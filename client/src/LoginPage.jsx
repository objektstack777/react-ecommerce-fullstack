import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'wouter';

import api from './api';
import { useAuth } from './AuthStore';
import { useFlashMessage } from './FlashMessageStore';

const loginSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Password is required'),
});

function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { showMessage } = useFlashMessage();

  const handleSubmit = async (
    values,
    formikHelpers
  ) => {
    try {
      const response = await api.post(
        '/auth/login',
        values
      );

      login(
        response.data.token,
        response.data.user
      );

      showMessage(
        response.data.message || 'Login successful',
        'success'
      );

      setLocation('/');
    } catch (error) {
      console.error('Login error:', error);

      showMessage(
        error.response?.data?.message ||
          'Unable to log in. Please try again.',
        'danger'
      );
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <h1 className="text-center mb-4">
            Login
          </h1>

          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label"
                  >
                    Email
                  </label>

                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    autoComplete="email"
                  />

                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="form-label"
                  >
                    Password
                  </label>

                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    autoComplete="current-password"
                  />

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Logging in...'
                    : 'Login'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;