import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getJson', () => {
    it('debe hacer fetch a la URL correcta', async () => {
      const { getJson } = await import('../api/client.js');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      });

      await getJson('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/test',
        expect.any(Object)
      );
    });

    it('debe incluir token de autenticacion si existe', async () => {
      const { getJson } = await import('../api/client.js');
      
      localStorage.setItem('token', 'test-token-123');
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      });

      await getJson('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token-123'
          })
        })
      );
    });

    it('debe lanzar error si la respuesta no es ok', async () => {
      const { getJson } = await import('../api/client.js');
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(getJson('/test')).rejects.toThrow('Error 404');
    });
  });

  describe('postJson', () => {
    it('debe hacer POST con datos correctos', async () => {
      const { postJson } = await import('../api/client.js');
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'created' })
      });

      const data = { nombre: 'Test' };
      await postJson('/test', data);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data)
        })
      );
    });
  });

  describe('putJson', () => {
    it('deba hacer PUT con datos correctos', async () => {
      const { putJson } = await import('../api/client.js');
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'updated' })
      });

      const data = { nombre: 'Updated' };
      await putJson('/test/1', data);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/test/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(data)
        })
      );
    });
  });

  describe('deleteJson', () => {
    it('debe hacer DELETE con cabeceras de autenticacion', async () => {
      const { deleteJson } = await import('../api/client.js');

      localStorage.setItem('token', 'test-token-123');
      mockFetch.mockResolvedValueOnce({
        ok: true
      });

      await deleteJson('/test/1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/test/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token-123'
          })
        })
      );
    });
  });

  describe('normalizeList', () => {
    it('debe devolver arrays directos sin modificarlos', async () => {
      const { normalizeList } = await import('../api/client.js');
      const items = [{ id: 1 }];

      expect(normalizeList(items)).toBe(items);
    });

    it('debe aceptar respuestas con data', async () => {
      const { normalizeList } = await import('../api/client.js');

      expect(normalizeList({ data: [{ id: 1 }], meta: { total: 1 } })).toEqual([{ id: 1 }]);
    });

    it('debe aceptar respuestas con items', async () => {
      const { normalizeList } = await import('../api/client.js');

      expect(normalizeList({ items: [{ id: 1 }], total: 1 })).toEqual([{ id: 1 }]);
    });

    it('debe devolver array vacio ante contratos no listables', async () => {
      const { normalizeList } = await import('../api/client.js');

      expect(normalizeList({ data: { id: 1 } })).toEqual([]);
      expect(normalizeList(null)).toEqual([]);
    });
  });
});
