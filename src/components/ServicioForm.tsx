import React, { useState } from 'react';
import { Servicio } from '../types/types';

interface ServicioFormProps {
  servicio?: Servicio;
  onSubmit: (servicio: Servicio) => void;
  onCancel: () => void;
}

const ServicioForm: React.FC<ServicioFormProps> = ({ servicio, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Servicio>>(servicio || {
    nombre: '',
    isActivo: true,
    imagen: '',
    funcionarios: [],
    locales: [],
    themes: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Servicio);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="isActivo">Activo:</label>
        <input
          type="checkbox"
          id="isActivo"
          name="isActivo"
          checked={formData.isActivo}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="imagen">Imagen URL:</label>
        <input
          type="text"
          id="imagen"
          name="imagen"
          value={formData.imagen}
          onChange={handleChange}
        />
      </div>
      {/* TODO: Add inputs for funcionarios, locales, and themes */}
      <button type="submit">{servicio ? 'Update' : 'Create'}</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default ServicioForm;