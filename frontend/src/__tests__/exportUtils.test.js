import { describe, it, expect } from 'vitest';
import { toCSV, exportTurnos, exportAsignaciones, exportTrabajadores } from '../utils/exportUtils.js';

describe('Export Utils', () => {
  describe('toCSV', () => {
    it('debe generar headers separados por punto y coma', () => {
      const data = [{ id: 1 }];
      const columns = [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' }
      ];
      
      const result = toCSV(data, columns);
      const lines = result.split('\n');
      
      expect(lines[0]).toBe('ID;Nombre');
    });

    it('debe generar filas con los datos correctos', () => {
      const data = [
        { id: 1, nombre: 'Test' }
      ];
      const columns = [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' }
      ];
      
      const result = toCSV(data, columns);
      const lines = result.split('\n');
      
      expect(lines[1]).toBe('1;Test');
    });

    it('debe manejar valores nulos', () => {
      const data = [{ id: 1, nombre: null }];
      const columns = [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' }
      ];
      
      const result = toCSV(data, columns);
      const lines = result.split('\n');
      
      expect(lines[1]).toBe('1;');
    });

    it('debe escapar valores con punto y coma', () => {
      const data = [{ id: 1, nombre: 'Test;ConPunto' }];
      const columns = [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' }
      ];
      
      const result = toCSV(data, columns);
      const lines = result.split('\n');
      
      expect(lines[1]).toBe('1;"Test;ConPunto"');
    });

    it('debe devolver string vacio si no hay datos', () => {
      const data = [];
      const columns = [{ key: 'id', label: 'ID' }];
      
      const result = toCSV(data, columns);
      
      expect(result).toBe('');
    });
  });

  describe('exportTurnos', () => {
    it('debe estar definido como funcion', () => {
      expect(typeof exportTurnos).toBe('function');
    });
  });

  describe('exportAsignaciones', () => {
    it('debe estar definido como funcion', () => {
      expect(typeof exportAsignaciones).toBe('function');
    });
  });

  describe('exportTrabajadores', () => {
    it('debe estar definido como funcion', () => {
      expect(typeof exportTrabajadores).toBe('function');
    });
  });
});