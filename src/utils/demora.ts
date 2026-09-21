/**
 * Retardo simulado para los servicios.
 * Permite que las pantallas manejen estados de carga reales (RNF-UX-03) y que en EP2
 * el cambio a una API REST no altere la forma en que se consumen los servicios.
 */
export function demora(milisegundos = 250): Promise<void> {
  return new Promise((resolver) => {
    setTimeout(resolver, milisegundos);
  });
}
