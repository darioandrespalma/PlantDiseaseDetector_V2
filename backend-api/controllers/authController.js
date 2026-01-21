const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- REGISTRO DE USUARIO ---
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 1. Validar si existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // 2. Crear usuario (El modelo User.js ya hashea la password en pre-save)
    const user = await User.create({
      username,
      email,
      password // Se pasa plano, el modelo lo encripta
    });

    // 3. Crear Payload (Estandarizado igual que Login)
    const payload = {
      user: {
        _id: user._id, // Usamos guion bajo para consistencia con Mongo
        username: user.username,
        role: 'agricultor'
      }
    };

    // 4. Firmar Token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secretoseguro123',
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        // Respuesta exitosa
        res.status(201).json({
          success: true,
          token,
          user: payload.user
        });
      }
    );

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error en el servidor al registrar' });
  }
};

// --- LOGIN DE USUARIO ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // 2. Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // 3. Crear Payload (Igual que Register)
    const payload = {
      user: {
        _id: user._id,
        username: user.username,
        role: 'agricultor'
      }
    };

    // 4. Firmar Token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secretoseguro123',
      { expiresIn: '30d' }, // Aumentado a 30 días para evitar expiración rápida en desarrollo
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: payload.user
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};