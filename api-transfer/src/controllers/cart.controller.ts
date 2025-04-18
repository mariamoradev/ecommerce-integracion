import { Request, Response } from 'express';
import { db } from '../models/db'; // Asegúrate que sea una conexión tipo mysql2/promise
import { v4 as uuidv4 } from 'uuid';

// Agregar ítem al carrito
export const addCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      res.status(400).json({ error: 'Faltan datos necesarios: userId, productId o quantity' });
      return;
    }

    // Verifica si el carrito ya existe
    const [cartRows]: any = await db.query('SELECT cart_id FROM cart WHERE user_id = ?', [userId]);
    let cartId: string;

    if (cartRows.length === 0) {
      cartId = uuidv4();
      await db.query(
        'INSERT INTO cart (cart_id, user_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
        [cartId, userId]
      );
    } else {
      cartId = cartRows[0].cart_id;
    }

    // Verifica si el producto ya está en el carrito
    const [itemRows]: any = await db.query(
      'SELECT * FROM cart_item WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (itemRows.length > 0) {
      await db.query(
        'UPDATE cart_item SET quantity = quantity + ?, updated_at = NOW() WHERE cart_id = ? AND product_id = ?',
        [quantity, cartId, productId]
      );
      res.status(200).json({ message: 'Cantidad actualizada en el carrito' });
    } else {
      const itemId = uuidv4();
      await db.query(
        'INSERT INTO cart_item (item_id, cart_id, product_id, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [itemId, cartId, productId, quantity]
      );
      res.status(201).json({ message: 'Ítem agregado al carrito' });
    }
  } catch (error) {
    console.error('Error en addCartItem:', error);
    res.status(500).json({ error: 'Error al agregar el ítem al carrito' });
  }
};

// Eliminar ítem del carrito
export const deleteCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    if (!userId || !productId) {
      res.status(400).json({ error: 'Faltan datos necesarios: userId o productId' });
      return;
    }

    const [cartRows]: any = await db.query('SELECT cart_id FROM cart WHERE user_id = ?', [userId]);

    if (cartRows.length === 0) {
      res.status(404).json({ message: 'Carrito no encontrado' });
      return;
    }

    const cartId = cartRows[0].cart_id;

    const [result]: any = await db.query(
      'DELETE FROM cart_item WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: `Ítem con ID ${productId} eliminado del carrito` });
    } else {
      res.status(404).json({ message: `Ítem con ID ${productId} no encontrado en el carrito` });
    }
  } catch (error) {
    console.error('Error en deleteCartItem:', error);
    res.status(500).json({ error: 'Error al eliminar el ítem del carrito' });
  }
};
