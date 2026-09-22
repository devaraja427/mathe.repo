import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import AnalysisRecord
from ..schemas import (
    AnalysisRequest,
    AnalysisResponse,
    HistoryItem,
    HistoryDetailResponse,
)
from ..services.mathematics import analyze_academic_performance

router = APIRouter(prefix="/api", tags=["Academic Analysis"])


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Academic Dependency Analyzer API",
        "version": "1.0.0",
    }


@router.post("/analyze", response_model=AnalysisResponse)
def analyze(request: AnalysisRequest, db: Session = Depends(get_db)):
    try:
        result = analyze_academic_performance(
            components=request.components,
            student_name=request.student_name or "Student",
        )

        # Save record to SQLite history
        record = AnalysisRecord(
            student_name=result.student_name,
            components_count=len(result.components),
            matrix_rank=result.rank,
            independent_count=len(result.independent_factors),
            dependent_count=len(result.dependent_factors),
            projection_error=result.projection_error,
            components_data=json.dumps([c.model_dump() for c in result.components]),
            matrix_data=json.dumps(result.matrix),
            analysis_result=json.dumps(result.model_dump()),
        )
        db.add(record)
        db.commit()
        db.refresh(record)

        result.id = record.id
        result.created_at = record.created_at.isoformat()
        return result
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Mathematical analysis failed: {str(e)}",
        )


@router.get("/analyses", response_model=List[HistoryItem])
def get_analyses(db: Session = Depends(get_db)):
    records = db.query(AnalysisRecord).order_by(AnalysisRecord.created_at.desc()).all()
    history: List[HistoryItem] = []
    for r in records:
        try:
            comps = json.loads(r.components_data)
            comp_names = [c["name"] for c in comps]
        except Exception:
            comp_names = []

        history.append(
            HistoryItem(
                id=r.id,
                created_at=r.created_at.isoformat() if r.created_at else "",
                student_name=r.student_name or "Student",
                components_count=r.components_count,
                matrix_rank=r.matrix_rank,
                independent_count=r.independent_count,
                dependent_count=r.dependent_count,
                projection_error=r.projection_error,
                components_summary=comp_names,
            )
        )
    return history


@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_by_id(analysis_id: int, db: Session = Depends(get_db)):
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with id {analysis_id} not found",
        )
    try:
        data = json.loads(record.analysis_result)
        data["id"] = record.id
        data["created_at"] = record.created_at.isoformat() if record.created_at else None
        return AnalysisResponse(**data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not load analysis details: {str(e)}",
        )


@router.delete("/analyses/{analysis_id}")
def delete_analysis(analysis_id: int, db: Session = Depends(get_db)):
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with id {analysis_id} not found",
        )
    db.delete(record)
    db.commit()
    return {"message": f"Analysis {analysis_id} deleted successfully"}
