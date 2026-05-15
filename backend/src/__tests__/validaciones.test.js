import { jest } from '@jest/globals';

const mockPrisma = {
  turno: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  trabajador: {
    findUnique: jest.fn(),
  },
  asignacionTurno: {
    findUnique: jest.fn(),
  },
  ausencia: {
    findMany: jest.fn(),
  },
};

jest.unstable_mockModule('../db/prisma.js', () => ({
  getPrismaClient: () => mockPrisma,
}));

const { validarAsignacion } = await import('../services/validaciones.service.js');

describe('Validaciones Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validarAsignacion', () => {
    it('debe devolver error si el turno no existe', async () => {
      mockPrisma.turno.findUnique.mockResolvedValue(null);

      const resultado = await validarAsignacion(999, 1);

      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El turno no existe');
    });

    it('debe devolver error si el trabajador no existe', async () => {
      mockPrisma.turno.findUnique.mockResolvedValue({
        id: 1,
        codigo: 'T001',
        fecha: new Date(),
        servicio: { perfilRequerido: 'CUALQUIERA' }
      });
      mockPrisma.trabajador.findUnique.mockResolvedValue(null);

      const resultado = await validarAsignacion(1, 999);

      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El trabajador no existe');
    });

    it('debe devolver error si el trabajador no esta activo', async () => {
      mockPrisma.turno.findUnique.mockResolvedValue({
        id: 1,
        codigo: 'T001',
        fecha: new Date(),
        servicio: { perfilRequerido: 'CUALQUIERA' }
      });
      mockPrisma.trabajador.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Test',
        tipo: 'VIGILANTE',
        activo: false
      });

      const resultado = await validarAsignacion(1, 1);

      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El trabajador no esta activo');
    });

    it('debe devolver error si ya existe la asignacion', async () => {
      mockPrisma.turno.findUnique.mockResolvedValue({
        id: 1,
        codigo: 'T001',
        fecha: new Date(),
        servicio: { perfilRequerido: 'CUALQUIERA' }
      });
      mockPrisma.trabajador.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Test',
        tipo: 'VIGILANTE',
        activo: true
      });
      mockPrisma.asignacionTurno.findUnique.mockResolvedValue({ id: 1 });

      const resultado = await validarAsignacion(1, 1);

      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('Este trabajador ya esta asignado a este turno');
    });

    it('debe devolver valido cuando no hay conflictos', async () => {
      mockPrisma.turno.findUnique.mockResolvedValue({
        id: 1,
        codigo: 'T001',
        fecha: new Date('2024-01-15'),
        horaInicio: new Date('2024-01-15T08:00:00'),
        horaFin: new Date('2024-01-15T16:00:00'),
        servicio: { perfilRequerido: 'CUALQUIERA' }
      });
      mockPrisma.trabajador.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Test',
        tipo: 'VIGILANTE',
        activo: true
      });
      mockPrisma.asignacionTurno.findUnique.mockResolvedValue(null);
      mockPrisma.ausencia.findMany.mockResolvedValue([]);
      mockPrisma.turno.findMany.mockResolvedValue([]);

      const resultado = await validarAsignacion(1, 1);

      expect(resultado.valido).toBe(true);
      expect(resultado.errores).toHaveLength(0);
    });
  });
});