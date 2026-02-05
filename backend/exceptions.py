class SplitwiseClientError(Exception):
    """Base exception for SplitwiseClient errors."""
    pass

class InvalidCommentDataError(SplitwiseClientError):
    """Raised when comment data is invalid (e.g. empty items/participants)."""
    pass
