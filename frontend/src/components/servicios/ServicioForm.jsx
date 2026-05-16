import { useEffect, useMemo, useState } from 'react';
import { createServicio, updateServicio } from '../../api/catalogos';
import { CalendarDays, Car, Eye, Layers, Loader2, Save, Shield, X } from 'lucide-react';

const PERFILES = ['VIGILANTE', 'AUXILIAR', 'CUALQUIERA'];
const TIPOS = ['Vigilancia', 'Auxiliar', 'Coordinacion', 'A demanda', 'Mixto'];
const MODALIDADES = ['24/7', 'FIJO', 'VARIABLE', 'NOCTURNO', 'A_DEMANDA', 'LABORAL_DIURNO'];

export default function ServicioForm({ servicio, onSaved, onCancel, edificioList }) {
  const isEditing = !!servicio;

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    tipoOperativo: 'Vigilancia',
    modalidad: '24/7',
    horario: '',
    vehiculo: '',
    orden: 1,
    visibleCuadrante: true,
    perfilRequerido: 'VIGILANTE',
    dotacionMinima: 1,
    activo: true,
    edificioId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (servicio) {
      setFormData({
        codigo: servicio.codigo || '',
        nombre: servicio.nombre || '',
        descripcion: servicio.descripcion || '',
        tipoOperativo: servicio.tipoOperativo || 'Vigilancia',
        modalidad: servicio.modalidad || '24/7',
        horario: servicio.horario || '',
        vehiculo: servicio.vehiculo || '',
        orden: servicio.orden || 1,
        visibleCuadrante: servicio.visibleCuadrante ?? true,
        perfilRequerido: servicio.perfilRequerido || 'VIGILANTE',
        dotacionMinima: servicio.dotacionMinima || 1,
        activo: servicio.activo ?? true,
        edificioId: servicio.edificioId || servicio.edificio?.id || '',
      });
    }
  }, [servicio]);

  const edificio = useMemo(
    () => edificioList?.find((item) => String(item.id) === String(formData.edificioId)),
    [edificioList, formData.edificioId],
  );

  const estimatedHours = useMemo(() => {
    const dotacion = Number(formData.dotacionMinima) || 1;
    if (formData.modalidad === '24/7') return 24 * 365 * dotacion;
    if (formData.modalidad === 'NOCTURNO') return 10 * 310 * dotacion;
    if (formData.modalidad === 'LABORAL_DIURNO') return 8 * 220 * dotacion;
    if (formData.modalidad === 'A_DEMANDA') return 0;
    return 8 * 365 * dotacion;
  }, [formData.dotacionMinima, formData.modalidad]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        codigo: formData.codigo,
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        tipoOperativo: formData.tipoOperativo || null,
        modalidad: formData.modalidad || null,
        horario: formData.horario || null,
        vehiculo: formData.vehiculo || null,
        orden: parseInt(formData.orden) || 1,
        visibleCuadrante: formData.visibleCuadrante,
        perfilRequerido: formData.perfilRequerido,
        dotacionMinima: parseInt(formData.dotacionMinima) || 1,
        activo: formData.activo,
        edificioId: parseInt(formData.edificioId),
      };

      if (isEditing) await updateServicio(servicio.id, data);
      else await createServicio(data);
      onSaved();
    } catch (err) {
      setError(err.message || 'Error al guardar el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <Section icon={<Shield />} title="Identidad">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Codigo" required><input name="codigo" required value={formData.codigo} onChange={handleChange} className="input" placeholder="SERV_NUEVO" /></Field>
            <Field label="Nombre" required><input name="nombre" required value={formData.nombre} onChange={handleChange} className="input" placeholder="Nuevo servicio" /></Field>
          </div>
          <Field label="Descripcion"><textarea name="descripcion" rows={2} value={formData.descripcion} onChange={handleChange} className="input" placeholder="Alcance operativo del servicio" /></Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Edificio" required>
              <select name="edificioId" required value={formData.edificioId} onChange={handleChange} className="input">
                <option value="">Seleccionar edificio</option>
                {edificioList?.map((ed) => <option key={ed.id} value={ed.id}>{ed.nombre} ({ed.campus?.nombre || ed.campusId})</option>)}
              </select>
            </Field>
            <Field label="Tipo operativo">
              <div className="grid grid-cols-2 gap-2">
                {TIPOS.map((tipo) => <Choice key={tipo} active={formData.tipoOperativo === tipo} onClick={() => setField('tipoOperativo', tipo)}>{tipo}</Choice>)}
              </div>
            </Field>
          </div>
        </Section>

        <Section icon={<CalendarDays />} title="Cobertura horaria">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Modalidad">
              <select name="modalidad" value={formData.modalidad} onChange={handleChange} className="input">
                {MODALIDADES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Horario descriptivo"><input name="horario" value={formData.horario} onChange={handleChange} className="input" placeholder="06:00-14:00 / 24/7 / bajo demanda" /></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Perfil requerido">
              <select name="perfilRequerido" value={formData.perfilRequerido} onChange={handleChange} className="input">{PERFILES.map((p) => <option key={p} value={p}>{p}</option>)}</select>
            </Field>
            <Field label="Dotacion minima"><input type="number" name="dotacionMinima" min="1" value={formData.dotacionMinima} onChange={handleChange} className="input" /></Field>
            <Field label="Orden en cuadrante"><input type="number" name="orden" min="1" value={formData.orden} onChange={handleChange} className="input" /></Field>
          </div>
        </Section>

        <Section icon={<Car />} title="Recursos y visibilidad">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Vehiculo / recurso"><input name="vehiculo" value={formData.vehiculo} onChange={handleChange} className="input" placeholder="SUV electrico, SUV hibrido, sin vehiculo..." /></Field>
            <div className="space-y-3 pt-6">
              <Toggle name="visibleCuadrante" checked={formData.visibleCuadrante} onChange={handleChange} label="Visible en cuadrante mensual" />
              <Toggle name="activo" checked={formData.activo} onChange={handleChange} label="Servicio activo" />
            </div>
          </div>
        </Section>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={loading} className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 inline-flex items-center gap-2">
            <X className="w-4 h-4" /> Cancelar
          </button>
          <button type="submit" disabled={loading} className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 inline-flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? 'Guardar cambios' : 'Crear servicio'}
          </button>
        </div>
      </form>

      <aside className="h-fit sticky top-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500"><Eye className="h-4 w-4" /> Previsualizacion</div>
        <h3 className="mt-4 font-serif text-2xl font-semibold text-stone-900">{formData.nombre || 'Nuevo servicio'}</h3>
        <div className="mt-2 font-mono text-xs text-stone-500">#{formData.codigo || 'CODIGO'}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-stone-900 px-2 py-1 text-xs font-semibold text-white">{formData.tipoOperativo}</span>
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">{formData.modalidad}</span>
          <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-800">{formData.perfilRequerido}</span>
        </div>
        <dl className="mt-6 space-y-3 text-sm">
          <Preview label="Campus" value={edificio?.campus?.nombre || 'Sin seleccionar'} />
          <Preview label="Edificio" value={edificio?.nombre || 'Sin seleccionar'} />
          <Preview label="Horario" value={formData.horario || 'Pendiente'} />
          <Preview label="Dotacion" value={`${formData.dotacionMinima || 1} persona(s)`} />
          <Preview label="Vehiculo" value={formData.vehiculo || 'No definido'} />
          <Preview label="Horas estimadas" value={estimatedHours ? `${estimatedHours.toLocaleString('es-ES')} h/ano` : 'A demanda'} />
        </dl>
        <div className="mt-6 rounded-md bg-stone-50 p-3 text-xs text-stone-500">
          Esta estimacion es informativa. El cierre mensual se calculara con planificado/ejecutado real.
        </div>
      </aside>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 flex items-center gap-2 font-serif text-xl font-semibold text-stone-900">{icon && <span className="text-amber-700">{icon}</span>} {title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-stone-700">
      <span>{label} {required && <span className="text-red-500">*</span>}</span>
      {children}
    </label>
  );
}

function Choice({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-md border px-3 py-2 text-sm font-medium ${active ? 'border-amber-600 bg-amber-50 text-amber-800' : 'border-stone-200 bg-white text-stone-700 hover:border-amber-400'}`}>
      {children}
    </button>
  );
}

function Toggle({ name, checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
      {label}
    </label>
  );
}

function Preview({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-stone-500">{label}</dt>
      <dd className="text-right font-medium text-stone-800">{value}</dd>
    </div>
  );
}
