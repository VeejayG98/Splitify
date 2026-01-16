# API Changes

## Backend V2 Migration

### Social Routes (`backend/routes/social.py`)

1.  **`find_common_groups` Parameter Change:**
    *   **Old (Legacy):** `participants` was a comma-separated string (e.g., `?participants=1,2,3`).
    *   **New (V2):** `participants` is now a list of integers (e.g., `?participants=1&participants=2&participants=3`).
    *   **Reason:** Leveraging FastAPI/Pydantic validation and standard query parameter handling for lists. Frontend updates will be required when switching to this endpoint.

2.  **DTO Standardization:**
    *   All responses now use Pydantic models defined in `backend/dtos/`.

### Expense Routes (`backend/routes/expenses.py`)

1.  **Moved Endpoints:**
    *   `POST /expenses/add` (formerly `POST /add_expense` in V1): Creates a new expense.
    *   `POST /expenses/comments/add` (formerly `POST /add_comments` in V1): Adds a comment to an expense.
    *   **Note:** These routes use the Bearer token authorization scheme and expect JSON bodies compliant with `CreateExpense` and `CreateComment` schemas respectively.
