ROLE_PERMISSIONS = {
    "admin": [
        "execute_queries",
        "export_reports",
        "view_audit_logs",
        "manage_users",
        "manage_integrations",
        "upload_data",
        "view_reports",
    ],
    "business_user": [
        "execute_queries",
        "export_reports",
        "view_reports",
    ],
    "readonly": [
        "view_reports",
    ],
}


def has_permission(role: str, permission: str) -> bool:
    """Check whether a role has a specific permission."""
    permissions = ROLE_PERMISSIONS.get(role, [])
    return permission in permissions
