import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import { auth, db } from '../../configs/firebase';
import Logo from '../common/Logo';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login...');
    console.log('Firebase Config Project ID:', auth.app.options.projectId);
    setLoading(true);

    try {
      let email = '';

      // Check if input is an email
      if (username.includes('@')) {
        email = username;
      } else {
        // 1. Get user email from usernames collection (Secure Lookup)
        const userDocRef = doc(db, 'usernames', username);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          Swal.fire({
            icon: 'error',
            title: 'Usuario no encontrado',
            text: 'El nombre de usuario ingresado no existe.',
            confirmButtonColor: '#f20d0d',
          });
          setLoading(false);
          return;
        }

        const userData = userDocSnap.data();
        email = userData.email;
      }

      if (!email) {
        Swal.fire({
          icon: 'error',
          title: 'Configuración inválida',
          text: 'No se pudo obtener el correo del usuario.',
          confirmButtonColor: '#f20d0d',
        });
        setLoading(false);
        return;
      }

      // 2. Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');

      // 3. Get user role from users collection
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData.role;

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: '¡Inicio Exitoso!'
        })

        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'user') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }

    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'Ocurrió un error inesperado.';
      let errorTitle = 'Error';

      if (err.code === 'permission-denied') {
        errorTitle = 'Acceso Denegado';
        errorMessage = 'No tienes permisos para realizar esta acción.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorTitle = 'Credenciales Incorrectas';
        errorMessage = 'El usuario o la contraseña son incorrectos.';
      } else if (err.code === 'auth/too-many-requests') {
        errorTitle = 'Demasiados intentos';
        errorMessage = 'Has intentado ingresar demasiadas veces. Por favor espera unos minutos.';
      }

      Swal.fire({
        icon: 'error',
        title: errorTitle,
        text: errorMessage,
        confirmButtonColor: '#f20d0d',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/">
            <Logo className="scale-125" />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>

        {/* Error state removed from UI */}

        <p className="mt-2 text-center text-sm text-gray-600">
          O{' '}
          <Link to="/" className="font-medium text-primary hover:text-red-700">
            volver a la página principal
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nombre de Usuario
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-gray-400 hover:text-gray-500 cursor-pointer select-none">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-red-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors`}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
