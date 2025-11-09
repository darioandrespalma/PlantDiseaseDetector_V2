const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createTransporter, generateResetEmailTemplate } = require('../config/emailConfig');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📧 [DEBUG] Solicitando recuperación para:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ [ERROR] Usuario no encontrado");
      return res.status(400).json({ message: 'User not found' });
    }

    // Generar token y expiración
    const resetToken = user.generateResetToken();
    await user.save();

    console.log("✅ [DEBUG] Token generado:", resetToken);
    console.log("🔗 [DEBUG] URL de reset:", `http://localhost:4200/reset-password/${resetToken}`);

    // Configurar transporter
    const transporter = createTransporter();
    console.log("📤 [DEBUG] Transporter configurado");

    // Crear opciones del correo
    const mailOptions = {
      from: '"Plant Disease Detector" <no-reply@plantdisease.com>',
      to: user.email,
      subject: 'Restablece tu contraseña',
      html: generateResetEmailTemplate(`http://localhost:4200/reset-password/${resetToken}`),
    };

    console.log("📬 [DEBUG] Enviando correo a:", user.email);

    // Enviar correo con try/catch
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ [SUCCESS] Correo enviado con éxito!");
      console.log("📨 [INFO] Message ID:", info.messageId);
      console.log("🌐 [INFO] Verifica en Ethereal: https://ethereal.email/messages");
    } catch (emailError) {
      console.error("💥 [ERROR] Fallo al enviar correo:", emailError);
      return res.status(500).json({ message: 'Failed to send reset email' });
    }

    res.json({ message: 'Password reset link sent to your email' });

  } catch (error) {
    console.error("🚨 [CRITICAL ERROR] forgotPassword:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password - Validar token y cambiar contraseña
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Buscar usuario por token hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Cambiar contraseña y limpiar token
    await user.resetPassword(newPassword);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};