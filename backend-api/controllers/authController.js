const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear usuario (La contraseña se hashea en el modelo User con pre('save') generalmente, 
    // pero si lo haces aquí manualmente como vi en tu código anterior, asegúrate de no doble hashear)
    // Asumiré que el modelo se encarga o que envías la password tal cual para hash aquí.
    // Si tu modelo NO tiene pre-save hash, descomenta la linea de hash abajo.
    

    const user = await User.create({
      username,
      email,
      password: req.body.password
    });

    // Generar token
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
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al registrar' });
  }
};

// CAMBIO AQUÍ: De 'loginUser' a 'login'
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' }); // Usar message para consistencia
    }

    // 2. Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // 3. Crear el Payload
    const payload = {
      user: {
        id: user.id,
        nombre: user.username, // Ajustado a username según tu registro
        rol: 'agricultor'
      }
    };

    // 4. Firmar el Token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secretoseguro123',
      { expiresIn: '8h' },
      (err, token) => {
        if (err) throw err;
        // Retornamos estructura consistente
        res.json({ 
            token, 
            user: { 
                _id: user.id, 
                username: user.username, 
                email: user.email 
            } 
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};