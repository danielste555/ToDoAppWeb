import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types/Task';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updated: Partial<Task>) => void;
}

export default function EditTaskModal({ task, onClose, onSave }: EditTaskModalProps) {
  const [titre, setTitre] = useState(task.titre);
  const [description, setDescription] = useState(task.description || '');
  const [dateEcheance, setDateEcheance] = useState(task.dateEcheance || '');
  const [priorite, setPriorite] = useState(task.priorite);
  const [rappelActive, setRappelActive] = useState(!!task.rappelActive);
  const [dateRappel, setDateRappel] = useState(task.dateRappel || '');
  const [commentaire, setCommentaire] = useState(task.commentaire || '');

  const [dateEcheanceError, setDateEcheanceError] = useState('');
  const [dateRappelError, setDateRappelError] = useState('');

  const titreRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titreRef.current?.focus();
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const isFutureDate = (dateStr: string) => {
    const selected = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    return selected.getTime() >= today.getTime();
  };

  useEffect(() => {
    if (!dateEcheance) {
      setDateEcheanceError("La date d'échéance est requise.");
    } else if (!isFutureDate(dateEcheance)) {
      setDateEcheanceError("La date d'échéance doit être >= aujourd'hui.");
    } else {
      setDateEcheanceError('');
    }
  }, [dateEcheance]);

  useEffect(() => {
    if (rappelActive) {
      if (!dateRappel) {
        setDateRappelError("La date de rappel est requise.");
      } else if (!isFutureDate(dateRappel)) {
        setDateRappelError("Le rappel doit être >= aujourd'hui.");
      } else if (dateEcheance && new Date(dateRappel) > new Date(dateEcheance)) {
        setDateRappelError("Le rappel ne peut pas dépasser la date d'échéance.");
      } else {
        setDateRappelError('');
      }
    } else {
      setDateRappelError('');
    }
  }, [rappelActive, dateRappel, dateEcheance]);

  const isFormValid = () => {
    return titre.trim().length > 0 && !dateEcheanceError && (!rappelActive || !dateRappelError);
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    const updated: Partial<Task> = {
      ...task,
      titre: titre.trim(),
      description,
      dateEcheance,
      priorite,
      rappelActive,
      dateRappel: rappelActive ? dateRappel : null,
      commentaire,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered" ref={modalRef}>
        <div className="modal-content">
          <div className="modal-header">
            <input
              ref={titreRef}
              type="text"
              className={`form-control fs-5 fw-bold border-0 ${titre.trim() ? '' : 'is-invalid'}`}
              value={titre}
              onChange={e => setTitre(e.target.value)}
              required
            />
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Échéance *</label>
              <input
                type="date"
                className={`form-control ${dateEcheanceError ? 'is-invalid' : ''}`}
                value={dateEcheance}
                onChange={e => setDateEcheance(e.target.value)}
                required
              />
              {dateEcheanceError && <div className="invalid-feedback">{dateEcheanceError}</div>}
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
              />
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Priorité</label>
                <select className="form-select" value={priorite} onChange={e => setPriorite(Number(e.target.value))}>
                  <option value={1}>Urgent</option>
                  <option value={2}>Haut</option>
                  <option value={3}>Moyen</option>
                  <option value={4}>Faible</option>
                </select>
              </div>
              <div className="col-md-6 d-flex align-items-end">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={rappelActive}
                    onChange={e => setRappelActive(e.target.checked)}
                  />
                  <label className="form-check-label">Rappel</label>
                </div>
              </div>
            </div>
            {rappelActive && (
              <div className="mt-3">
                <label className="form-label">Date & Heure du rappel *</label>
                <input
                  type="datetime-local"
                  className={`form-control ${dateRappelError ? 'is-invalid' : ''}`}
                  value={dateRappel}
                  onChange={e => setDateRappel(e.target.value)}
                  required
                />
                {dateRappelError && <div className="invalid-feedback">{dateRappelError}</div>}
              </div>
            )}
            <div className="mt-3">
              <textarea
                className="form-control"
                rows={2}
                value={commentaire}
                onChange={e => setCommentaire(e.target.value)}
                placeholder="Commentaire (optionnel)"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={!isFormValid()}>
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
