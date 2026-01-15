from pydantic import BaseModel, ConfigDict

class ReadDto(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
