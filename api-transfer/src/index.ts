import express from 'express';
import dotenv from 'dotenv';
import cartRoutes from './routes/cart.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 👇 Aquí solo debes pasar el router directamente, SIN paréntesis
app.use('/api/cart', cartRoutes);

app.listen(port, () => {
  console.log(`Carrito escuchando en http://localhost:${port}`);
});
