from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.auth.jwt_handler import verify_access_token
from app.auth.roles import has_permission
from app.governance.audit_logger import log_query_event


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Return the decoded JWT payload for the current request."""
    decoded_payload = verify_access_token(token)

    if decoded_payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return decoded_payload


def log_permission_denied(current_user: dict) -> None:
    """Log a failed permission check."""
    username = current_user.get("sub", "unknown")
    role = current_user.get("role", "unknown")

    log_query_event(
        username=username,
        role=role,
        query_text="UNAUTHORIZED_ACCESS_ATTEMPT",
        is_safe=False,
    )


def require_permission(permission: str):
    """Create a dependency that checks whether the user has a permission."""

    def permission_checker(current_user: dict = Depends(get_current_user)) -> dict:
        role = current_user.get("role")

        if not has_permission(role, permission):
            log_permission_denied(current_user)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied",
            )

        return current_user

    return permission_checker
