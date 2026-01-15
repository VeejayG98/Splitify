# API Changes

## Backend V2 Migration

### Social Routes (`backend/routes/social.py`)

1.  **`find_common_groups` Parameter Change:**
    *   **Old (Legacy):** `participants` was a comma-separated string (e.g., `?participants=1,2,3`).
    *   **New (V2):** `participants` is now a list of integers (e.g., `?participants=1&participants=2&participants=3`).
    *   **Reason:** Leveraging FastAPI/Pydantic validation and standard query parameter handling for lists. Frontend updates will be required when switching to this endpoint.

2.  **DTO Standardization:**
    *   All responses now use Pydantic models defined in `backend/dtos/`.
