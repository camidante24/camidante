-- Seed CamiDante local posts (idempotente por slug)
delete from public.posts where slug in ('pausa-prolongada', 'estudios-terracota', 'herramientas-pensar', 'diario-kioto-2019');

insert into public.posts (
  id, slug, title, excerpt, body, category, cover_image, reading_minutes,
  published, published_at, tags, featured, size
) values (
  'a1000000-0000-4000-8000-000000000001'::uuid,
  'pausa-prolongada',
  'La anatomía de una pausa prolongada',
  'En un mundo que exige velocidad constante, el acto de detenerse se convierte en una forma de rebelión artística. Una reflexión sobre cómo el silencio nutre el proceso creativo.',
  $camidante_body_0$En la incesante prisa de nuestros días, encontrar un espacio para la quietud se ha convertido en un acto de rebelión silenciosa.

## Más que ausencia de ruido

La pausa no es vacío: es **atención deliberada**. Cuando dejamos de responder al siguiente estímulo, la mente recupera profundidad.

> La verdadera innovación no siempre grita; a veces, simplemente susurra en el espacio entre dos pensamientos.

### Tres gestos pequeños

1. Reservar quince minutos sin pantalla al despertar.
2. Escribir a mano una página, aunque sea ilegible.
3. Caminar sin auriculares una vez al día.

El cuerpo aprende el ritmo antes que el intelecto. Ahí empieza el oficio del pensamiento lento.$camidante_body_0$,
  'Escritos',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200',
  6,
  true,
  '2024-10-12T12:00:00.000Z'::timestamptz,
  ARRAY['Reflexión', 'Ritmo', 'Silencio']::text[],
  false,
  'large'
);

insert into public.posts (
  id, slug, title, excerpt, body, category, cover_image, reading_minutes,
  published, published_at, tags, featured, size
) values (
  'a1000000-0000-4000-8000-000000000002'::uuid,
  'estudios-terracota',
  'Estudios en Terracota',
  'Bocetos preliminares y la búsqueda del color perfecto que capture la luz de la tarde.',
  $camidante_body_1$La terracota no perdona la prisa: el barro pide tiempo de asentamiento y el horno, su propia conversación con el color.

## Sobre el matiz

Cada capa de engobe es una decisión irreversible hasta el siguiente error feliz. En el taller, **la luz de la tarde** es el juez final: lo que parecía exacto al mediodía se vuelve extraño a las seis.

### Notas de taller

- Llevar un registro fotográfico *a la misma hora* durante una semana.
- Comparar muestras pequeñas antes de tocar piezas grandes.
- Aceptar el craquelado como memoria del proceso.

Pintar es editar la superficie hasta que el ojo descanse.$camidante_body_1$,
  'Arte',
  'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=800',
  4,
  true,
  '2024-10-05T12:00:00.000Z'::timestamptz,
  ARRAY['Color', 'Cerámica', 'Luz']::text[],
  false,
  'small'
);

insert into public.posts (
  id, slug, title, excerpt, body, category, cover_image, reading_minutes,
  published, published_at, tags, featured, size
) values (
  'a1000000-0000-4000-8000-000000000003'::uuid,
  'herramientas-pensar',
  'Herramientas para pensar mejor',
  'Por qué los materiales analógicos siguen siendo superiores para estructurar arquitecturas mentales complejas.',
  $camidante_body_2$Un cuaderno de tapas duras y un bolígrafo barato pueden sostener ideas que una docena de aplicaciones dispersas no logran retener.

## Espacio y fricción

La **fricción** —voltear páginas, tachar, reordenar tarjetas— no es ineficiencia: es la forma en que el cerebro marca lo importante.

### Lo que uso a diario

| Herramienta | Para qué sirve |
|-------------|----------------|
| Índice alfabético | Recuperar conceptos, no citas |
| Post-its grandes | Mapas rápidos en la pared |
| Lista semanal en papel | Límites claros de carga mental |

Cuando el sistema digital solo archiva, el analógico obliga a elegir.$camidante_body_2$,
  'Pensamientos',
  'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800',
  5,
  true,
  '2024-09-28T12:00:00.000Z'::timestamptz,
  ARRAY['Analogía', 'Productividad suave', 'Notas']::text[],
  false,
  'medium'
);

insert into public.posts (
  id, slug, title, excerpt, body, category, cover_image, reading_minutes,
  published, published_at, tags, featured, size
) values (
  'a1000000-0000-4000-8000-000000000004'::uuid,
  'diario-kioto-2019',
  'Fragmentos de un diario de viaje: Kioto, 2019',
  'Revisando notas antiguas escritas a mano bajo la luz de un farol de papel. La memoria como un ejercicio de edición constante.',
  $camidante_body_3$Releer un diario de viaje no es revivir el viaje: es **reeditar** al viajero que fuimos.

## Kioto, noche de lluvia

Las entradas más breves son las que más pesan: una direón, un olor a cedro mojado, una frase incompleta que entonces parecía trivial.

### Lo que conservo

- Billetes doblados como marcapáginas accidentales.
- Un sello mal estampado en la última página.
- La lista de templos *no visitados* —también parte del mapa.

La memoria trabaja como un buen ensayo: recorta hasta que queda una línea que pueda sostenerse sola.$camidante_body_3$,
  'Archivo',
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=800',
  7,
  true,
  '2024-09-15T12:00:00.000Z'::timestamptz,
  ARRAY['Viaje', 'Memoria', 'Japón']::text[],
  true,
  'medium'
);

