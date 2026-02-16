const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    
    // Por seguridad, aunque no exista el usuario, respondemos "OK" para no revelar correos registrados
    if (!user) {
      return res.status(200).json({ success: true, message: 'Si el correo existe, se envió el enlace.' });
    }

    // Generar Token Aleatorio
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Guardar Token en DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // Expira en 1 hora (3600000 ms)
    await user.save();

    // Crear URL del enlace (Apunta a tu Frontend)
    // Asegúrate de definir FRONTEND_URL en tu .env o usa localhost:5173
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    // Enviar Correo
    const message = `
      <h1>Recuperación de Contraseña</h1>
      <p>Has solicitado restablecer tu contraseña en PlantDetector.</p>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${resetUrl}" style="background:#4F46E5; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Restablecer Contraseña</a>
      <p>Este enlace expira en 1 hora.</p>
      <small>Si no solicitaste esto, ignora este correo.</small>
    `;

    await transporter.sendMail({
      from: `"Soporte PlantDetector" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Recuperación de Contraseña',
      html: message
    });

    res.status(200).json({ success: true, message: 'Correo enviado correctamente' });

  } catch (err) {
    console.error('Error enviando correo:', err);
    // Si falla, limpiamos el token del usuario para evitar inconsistencias
    if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
    }
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
};
exports.resetPassword = async (req, res) => {
  // 1. Obtenemos el token de la URL y la password del body
  const { token } = req.params;
  const { password } = req.body;

  try {
    // 2. Busamos al usuario que tenga ese token Y que el tiempo no haya expirado ($gt = greater than / mayor que ahora)
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token inválido o expirado' });
    }

    // 3. Actualizamos la contraseña
    // IMPORTANTE: Al asignar el valor directamente, el middleware "pre save" de tu modelo User.js se encargará de hashearla automáticamente.
    user.password = password;

    // 4. Limpiamos el token (ya se usó)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // 5. Guardamos
    await user.save();

    res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al restablecer contraseña' });
  }
};