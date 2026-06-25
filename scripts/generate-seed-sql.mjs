import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

/** Regenera la migración de seed (idempotente por slug). Salida: supabase/migrations/20250512120000_seed_local_posts.sql — ejecutar `npm run db:seed-sql`. */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const posts = [
  {
    id: 'a1000000-0000-4000-8000-000000000001',
    slug: 'pausa-prolongada',
    title: 'La anatomía de una pausa prolongada',
    excerpt:
      'En un mundo que exige velocidad constante, el acto de detenerse se convierte en una forma de rebelión artística. Una reflexión sobre cómo el silencio nutre el proceso creativo.',
    body: `En la incesante prisa de nuestros días, encontrar un espacio para la quietud se ha convertido en un acto de rebelión silenciosa.

## Más que ausencia de ruido

La pausa no es vacío: es **atención deliberada**. Cuando dejamos de responder al siguiente estímulo, la mente recupera profundidad.

> La verdadera innovación no siempre grita; a veces, simplemente susurra en el espacio entre dos pensamientos.

### Tres gestos pequeños

1. Reservar quince minutos sin pantalla al despertar.
2. Escribir a mano una página, aunque sea ilegible.
3. Caminar sin auriculares una vez al día.

El cuerpo aprende el ritmo antes que el intelecto. Ahí empieza el oficio del pensamiento lento.`,
    category: 'Escritos',
    published_at: '2024-10-12T12:00:00.000Z',
    cover_image:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200',
    reading_minutes: 6,
    tags: ['Reflexión', 'Ritmo', 'Silencio'],
    featured: false,
    size: 'large',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000002',
    slug: 'estudios-terracota',
    title: 'Estudios en Terracota',
    excerpt:
      'Bocetos preliminares y la búsqueda del color perfecto que capture la luz de la tarde.',
    body: `La terracota no perdona la prisa: el barro pide tiempo de asentamiento y el horno, su propia conversación con el color.

## Sobre el matiz

Cada capa de engobe es una decisión irreversible hasta el siguiente error feliz. En el taller, **la luz de la tarde** es el juez final: lo que parecía exacto al mediodía se vuelve extraño a las seis.

### Notas de taller

- Llevar un registro fotográfico *a la misma hora* durante una semana.
- Comparar muestras pequeñas antes de tocar piezas grandes.
- Aceptar el craquelado como memoria del proceso.

Pintar es editar la superficie hasta que el ojo descanse.`,
    category: 'Arte',
    published_at: '2024-10-05T12:00:00.000Z',
    cover_image:
      'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=800',
    reading_minutes: 4,
    tags: ['Color', 'Cerámica', 'Luz'],
    featured: false,
    size: 'small',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000003',
    slug: 'herramientas-pensar',
    title: 'Herramientas para pensar mejor',
    excerpt:
      'Por qué los materiales analógicos siguen siendo superiores para estructurar arquitecturas mentales complejas.',
    body: `Un cuaderno de tapas duras y un bolígrafo barato pueden sostener ideas que una docena de aplicaciones dispersas no logran retener.

## Espacio y fricción

La **fricción** —voltear páginas, tachar, reordenar tarjetas— no es ineficiencia: es la forma en que el cerebro marca lo importante.

### Lo que uso a diario

| Herramienta | Para qué sirve |
|-------------|----------------|
| Índice alfabético | Recuperar conceptos, no citas |
| Post-its grandes | Mapas rápidos en la pared |
| Lista semanal en papel | Límites claros de carga mental |

Cuando el sistema digital solo archiva, el analógico obliga a elegir.`,
    category: 'Pensamientos',
    published_at: '2024-09-28T12:00:00.000Z',
    cover_image:
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800',
    reading_minutes: 5,
    tags: ['Analogía', 'Productividad suave', 'Notas'],
    featured: false,
    size: 'medium',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000004',
    slug: 'diario-kioto-2019',
    title: 'Fragmentos de un diario de viaje: Kioto, 2019',
    excerpt:
      'Revisando notas antiguas escritas a mano bajo la luz de un farol de papel. La memoria como un ejercicio de edición constante.',
    body: `Releer un diario de viaje no es revivir el viaje: es **reeditar** al viajero que fuimos.

## Kioto, noche de lluvia

Las entradas más breves son las que más pesan: una direón, un olor a cedro mojado, una frase incompleta que entonces parecía trivial.

### Lo que conservo

- Billetes doblados como marcapáginas accidentales.
- Un sello mal estampado en la última página.
- La lista de templos *no visitados* —también parte del mapa.

La memoria trabaja como un buen ensayo: recorta hasta que queda una línea que pueda sostenerse sola.`,
    category: 'Archivo',
    published_at: '2024-09-15T12:00:00.000Z',
    cover_image:
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=800',
    reading_minutes: 7,
    tags: ['Viaje', 'Memoria', 'Japón'],
    featured: true,
    size: 'medium',
  },
];

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "''");
}

function dollarTag(body, i) {
  let tag = `camidante_body_${i}`;
  while (body.includes('$' + tag + '$')) tag += 'x';
  return tag;
}

const slugs = posts.map((p) => `'${esc(p.slug)}'`).join(', ');
let out = `-- Seed CamiDante local posts (idempotente por slug)\ndelete from public.posts where slug in (${slugs});\n\n`;

for (let i = 0; i < posts.length; i++) {
  const p = posts[i];
  const tag = dollarTag(p.body, i);
  const tagsSql = `ARRAY[${p.tags.map((t) => `'${esc(t)}'`).join(', ')}]::text[]`;
  out += `insert into public.posts (
  id, slug, title, excerpt, body, category, cover_image, reading_minutes,
  published, published_at, tags, featured, size
) values (
  '${p.id}'::uuid,
  '${esc(p.slug)}',
  '${esc(p.title)}',
  '${esc(p.excerpt)}',
  $${tag}$${p.body}$${tag}$,
  '${esc(p.category)}',
  '${esc(p.cover_image)}',
  ${p.reading_minutes},
  true,
  '${p.published_at}'::timestamptz,
  ${tagsSql},
  ${p.featured},
  '${esc(p.size)}'
);\n\n`;
}

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250512120000_seed_local_posts.sql');
fs.writeFileSync(outPath, out, 'utf8');
console.error('Written:', outPath);
