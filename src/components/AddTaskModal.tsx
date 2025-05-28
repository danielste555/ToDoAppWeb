import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types/Task';
import { JwtService } from '../services/jwt.service';


interface AddTaskModalProps {
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

export default function AddTaskModal({ onClose, onSave }: AddTaskModalProps) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [dateEcheance, setDateEcheance] = useState('');
  const [priorite, setPriorite] = useState(1);
  const [rappelActive, setRappelActive] = useState(false);
  const [dateRappel, setDateRappel] = useState('');
  const [commentaire, setCommentaire] = useState('');

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

  // Validation helpers
  const isFutureDate = (dateStr: string) => {
        // 1. Créer la date sélectionnée en forçant l'interprétation en GMT-5
      const selectedDate = new Date(dateStr);
      
      // 2. Ajuster pour GMT-5 (si nécessaire selon votre cas réel)
      const selectedGMT5 = new Date(selectedDate.getTime());
      
      // 3. Créer la date d'aujourd'hui en GMT-5
      const now = new Date();
      const todayGMT5 = new Date(now.getTime() - (5 * 60 * 60 * 1000));
      
      // 4. Normaliser à minuit GMT-5
      const selectedDay = new Date(selectedGMT5);
      selectedDay.setUTCHours(0, 0, 0, 0);
      
      const todayDay = new Date(todayGMT5);
      todayDay.setUTCHours(0, 0, 0, 0);
      
      // 5. Comparaison finale
      return selectedDay >= todayDay;
  };

  // Validate dateEcheance
  useEffect(() => {
    if (!dateEcheance) {
      setDateEcheanceError("La date d'échéance est requise.");
    } else if (!isFutureDate(dateEcheance)) {
      setDateEcheanceError("La date d'échéance doit être postérieure à aujourd'hui.");
      console.log(dateEcheance);
    } else {
      setDateEcheanceError('');
    }
    // also reset rappel error when échéance changes
    if (rappelActive && dateRappel) {
      if (!isFutureDate(dateRappel)) {
        setDateRappelError("La date de rappel doit être postérieure à aujourd'hui.");
      } else if (new Date(dateRappel) > new Date(dateEcheance)) {
        setDateRappelError("Le rappel ne peut pas dépasser la date d'échéance.");
      } else {
        setDateRappelError('');
      }
    }
  }, [dateEcheance, rappelActive, dateRappel]);

  // Validate dateRappel
  useEffect(() => {
    if (rappelActive) {
      if (!dateRappel) {
        setDateRappelError("La date de rappel est requise.");
      } else if (!isFutureDate(dateRappel)) {
        setDateRappelError("La date de rappel doit être postérieure à aujourd'hui.");
      } else if (dateEcheance && new Date(dateRappel).setHours(0, 0, 0, 0) > new Date(dateEcheance).setHours(0, 0, 0, 0)) {
        setDateRappelError("Le rappel ne peut pas dépasser la date d'échéance.");
      } else {
        setDateRappelError('');
      }
    } else {
      setDateRappelError('');
    }
  }, [dateRappel, dateEcheance, rappelActive]);

  const isFormValid = () => {
    return (
      titre.trim().length > 0 &&
      !dateEcheanceError &&
      (!rappelActive || !dateRappelError)
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    const token = localStorage.getItem('token');
    const id_user = JwtService.getUserId(token)?.toString();
    const newTask: Partial<Task> = {
      idUser: id_user,
      titre: titre.trim(),
      description,
      dateEcheance,
      priorite,
      rappelActive,
      dateRappel: rappelActive ? dateRappel : null,
      commentaire,
    };
    onSave(newTask);
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
              placeholder="Ajouter une tâche..."
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
            />
          </div>
          <div className="modal-body">
            {/** Échéance obligatoire **/}
            <div className="mb-3">
              <label htmlFor="dateEcheance" className="form-label">
                Échéance *
              </label>
              <input
                type="date"
                id="dateEcheance"
                className={`form-control ${dateEcheanceError ? 'is-invalid' : ''}`}
                value={dateEcheance}
                onChange={(e) => setDateEcheance(e.target.value)}
                required
              />
              {dateEcheanceError && (
                <div className="invalid-feedback">{dateEcheanceError}</div>
              )}
            </div>

            {/** Description **/}
            <div className="mb-3">
              <textarea
                className="form-control"
                rows={2}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="priorite" className="form-label">
                  Priorité
                </label>
                <select
                  id="priorite"
                  className="form-select"
                  value={priorite}
                  onChange={(e) => setPriorite(Number(e.target.value))}
                >
                  <option value={1}>Urgent</option>
                  <option value={2}>Haut</option>
                  <option value={3}>Moyen</option>
                  <option value={4}>Faible</option>
                </select>
              </div>
              <div className="col-md-6 d-flex align-items-end">
                <div className="form-check">
                  <input
                    id="rappelActive"
                    className="form-check-input"
                    type="checkbox"
                    checked={rappelActive}
                    onChange={(e) => setRappelActive(e.target.checked)}
                  />
                  <label htmlFor="rappelActive" className="form-check-label">
                    Rappel
                  </label>
                </div>
              </div>
            </div>

            {rappelActive && (
              <div className="mt-3">
                <label htmlFor="dateRappel" className="form-label">
                  Date & Heure du rappel *
                </label>
                <input
                  type="datetime-local"
                  id="dateRappel"
                  className={`form-control ${dateRappelError ? 'is-invalid' : ''}`}
                  value={dateRappel}
                  onChange={(e) => setDateRappel(e.target.value)}
                  required
                />
                {dateRappelError && (
                  <div className="invalid-feedback">{dateRappelError}</div>
                )}
              </div>
            )}

            {/** Commentaire **/}
            <div className="mt-3">
              <textarea
                className="form-control"
                rows={2}
                placeholder="Commentaire (optionnel)"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!isFormValid()}
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
