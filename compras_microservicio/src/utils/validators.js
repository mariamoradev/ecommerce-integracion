// src/utils/validators.js

/**
 * Valida la entrada de una orden.
 * @param {Object} order - La orden a validar.
 * @returns {null|string} - Devuelve null si es válida; de lo contrario, retorna un mensaje de error.
 */
function validateOrder(order) {
    if (!order.userId) {
      return 'El campo "userId" es obligatorio.';
    }
    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      return 'El campo "items" es obligatorio y debe ser un arreglo con al menos un ítem.';
    }
    for (let i = 0; i < order.items.length; i++) {
      const { productId, quantity, price } = order.items[i];
      if (!productId) {
        return `El "productId" es obligatorio en el ítem en la posición ${i}.`;
      }
      if (typeof quantity !== 'number' || quantity <= 0) {
        return `La "quantity" debe ser un número mayor que cero en el ítem en la posición ${i}.`;
      }
      if (typeof price !== 'number' || price <= 0) {
        return `El "price" debe ser un número mayor que cero en el ítem en la posición ${i}.`;
      }
    }
    return null;
  }
  
  module.exports = { validateOrder };
  