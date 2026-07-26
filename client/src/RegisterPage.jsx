import { useLocation } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    ErrorMessage,
    Field,
    Form,
    Formik,
} from 'formik';
import * as Yup from 'yup';

const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    salutation: '',
    marketingPreferences: [],
    country: '',
};

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required'),

    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),

    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),

    confirmPassword: Yup.string()
        .oneOf(
            [Yup.ref('password'), null],
            'Passwords must match'
        )
        .required('Confirm Password is required'),

    salutation: Yup.string()
        .required('Salutation is required'),

    country: Yup.string()
        .required('Country is required'),
});

function RegisterPage() {
    const [
        marketingPreferences,
        setMarketingPreferences,
    ] = useState([]);

    const [, setLocation] = useLocation();
    const { showMessage } = useFlashMessage();

    useEffect(() => {
        const fetchMarketingPreferences = async () => {
            try {
                const response = await axios.get(
                    '/marketingPreferences.json'
                );

                setMarketingPreferences(response.data);
            } catch (error) {
                console.error(
                    'Error loading marketing preferences:',
                    error
                );
            }
        };

        fetchMarketingPreferences();
    }, []);

    const handleSubmit = async (values, formikHelpers) => {
        try {
            console.log('Form values:', values);

            showMessage(
                'Registration successful!',
                'success'
            );
        } catch (error) {
            console.error('Registration error:', error);

            showMessage(
                'Registration failed. Please try again.',
                'danger'
            );
        } finally {
            formikHelpers.setSubmitting(false);
            setLocation('/');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Register</h1>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(formik) => (
                    <Form>
                        <div className="mb-3">
                            <label
                                htmlFor="name"
                                className="form-label"
                            >
                                Name
                            </label>

                            <Field
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                            />

                            <ErrorMessage
                                name="name"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="email"
                                className="form-label"
                            >
                                Email
                            </label>

                            <Field
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                            />

                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger"
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
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                            />

                            <ErrorMessage
                                name="password"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="confirmPassword"
                                className="form-label"
                            >
                                Confirm Password
                            </label>

                            <Field
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                name="confirmPassword"
                            />

                            <ErrorMessage
                                name="confirmPassword"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Salutation
                            </label>

                            <div>
                                <div className="form-check form-check-inline">
                                    <Field
                                        className="form-check-input"
                                        type="radio"
                                        name="salutation"
                                        id="mr"
                                        value="Mr"
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="mr"
                                    >
                                        Mr
                                    </label>
                                </div>

                                <div className="form-check form-check-inline">
                                    <Field
                                        className="form-check-input"
                                        type="radio"
                                        name="salutation"
                                        id="ms"
                                        value="Ms"
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="ms"
                                    >
                                        Ms
                                    </label>
                                </div>

                                <div className="form-check form-check-inline">
                                    <Field
                                        className="form-check-input"
                                        type="radio"
                                        name="salutation"
                                        id="mrs"
                                        value="Mrs"
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="mrs"
                                    >
                                        Mrs
                                    </label>
                                </div>
                            </div>

                            <ErrorMessage
                                name="salutation"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Marketing Preferences
                            </label>

                            {marketingPreferences.map((preference) => (
                                <div
                                    className="form-check"
                                    key={preference.id}
                                >
                                    <Field
                                        type="checkbox"
                                        name="marketingPreferences"
                                        value={String(preference.id)}
                                        className="form-check-input"
                                        id={`marketing-${preference.id}`}
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor={`marketing-${preference.id}`}
                                    >
                                        {preference.name}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="country"
                                className="form-label"
                            >
                                Country
                            </label>

                            <Field
                                as="select"
                                className="form-select"
                                id="country"
                                name="country"
                                disabled={formik.isSubmitting}
                            >
                                <option value="">
                                    Select Country
                                </option>
                                <option value="sg">
                                    Singapore
                                </option>
                                <option value="my">
                                    Malaysia
                                </option>
                                <option value="in">
                                    Indonesia
                                </option>
                                <option value="th">
                                    Thailand
                                </option>
                            </Field>

                            <ErrorMessage
                                name="country"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={formik.isSubmitting}
                        >
                            Register
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default RegisterPage;