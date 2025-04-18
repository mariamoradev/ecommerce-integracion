import { db } from '../models/db';
import { producer } from './kafka.service';
import { v4 as uuidv4 } from 'uuid';

export const addItemToCart = async (userId: string, productId: string, quantity: number) => {
  const [cartRows]: any = await db.query('SELECT cart_id FROM cart WHERE user_id = ?', [userId]);
  let cartId: string;

  if (cartRows.length === 0) {
    cartId = uuidv4();
    await db.query('INSERT INTO cart (cart_id, user_id) VALUES (?, ?)', [cartId, userId]);
  } else {
    cartId = cartRows[0].cart_id;
  }

  const itemId = uuidv4();
  await db.query('INSERT INTO cart_item (item_id, cart_id, product_id, quantity) VALUES (?, ?, ?, ?)', [itemId, cartId, productId, quantity]);

  const payload = {
    eventId: `evt_${Date.now()}`,
    timestamp: new Date().toISOString(),
    source: 'CartUpdated',
    topic: 'cart-updates',
    payload: { userId, productId, quantity },
    snapshot: {
      cartId,
      totalItems: 1, // se puede mejorar con consulta real
      updatedAt: new Date().toISOString()
    }
  };

  await producer.send({
    topic: 'cart-updates',
    messages: [{ value: JSON.stringify(payload) }],
  });

  return { itemId, cartId };
};

export const removeItemFromCart = async (userId: string, productId: string) => {
  const [cartRows]: any = await db.query('SELECT cart_id FROM cart WHERE user_id = ?', [userId]);
  if (cartRows.length === 0) return null;

  const cartId = cartRows[0].cart_id;
  await db.query('DELETE FROM cart_item WHERE cart_id = ? AND product_id = ?', [cartId, productId]);

  const payload = {
    eventId: `evt_${Date.now()}`,
    timestamp: new Date().toISOString(),
    source: 'CartRemoval',
    topic: 'cart-removals',
    payload: { userId },
    snapshot: {
      userId,
      productId,
      quantity: 2 // opcional: podrías guardarlo antes de eliminar
    }
  };

  await producer.send({
    topic: 'cart-removals',
    messages: [{ value: JSON.stringify(payload) }],
  });

  await producer.send({
    topic: 'notification-topic',
    messages: [{
      value: JSON.stringify({
        to: 'juan@example.com',
        subject: '¿Olvidaste algo en tu carrito?',
        content: `Hola Juan, vimos que eliminaste 'Laptop HP' de tu carrito...`
      })
    }]
  });

  return { cartId };
};
