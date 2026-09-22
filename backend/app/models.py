import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from .database import Base


class AnalysisRecord(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    student_name = Column(String(100), default="Student")
    components_count = Column(Integer, nullable=False)
    matrix_rank = Column(Integer, nullable=False)
    independent_count = Column(Integer, nullable=False)
    dependent_count = Column(Integer, nullable=False)
    projection_error = Column(Float, nullable=False)
    components_data = Column(Text, nullable=False)  # JSON string
    matrix_data = Column(Text, nullable=False)  # JSON string
    analysis_result = Column(Text, nullable=False)  # JSON string of full result
