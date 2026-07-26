import { useEffect, useState } from 'react';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
} from 'formik';
import * as Yup from 'yup';
import { Link } from 'wouter';

import api from './api';
import { useAuth } from './AuthStore';
import { useFlashMessage } from './FlashMessageStore';

const emptyProduct = {
  name: '',
  price: '',
  imageUrl: '',
  description: '',
  category: '',
};

const productSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Product name is required'),

  price: Yup.number()
    .typeError('Price must be a number')
    .min(0, 'Price cannot be negative')
    .required('Price is required'),

  imageUrl: Yup.string()
    .url('Enter a valid image URL')
    .required('Image URL is required'),

  description: Yup.string()
    .trim()
    .required('Description is required'),

  category: Yup.string()
    .trim()
    .required('Category is required'),
});

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] =
    useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState('');

  const {
    auth,
    isAuthenticated,
  } = useAuth();

  const { showMessage } = useFlashMessage();

  const isAdmin =
    isAuthenticated &&
    auth.user?.role === 'admin';

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await api.get('/products');

      setProducts(response.data);
    } catch (error) {
      console.error(
        'Admin product loading error:',
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
          'Unable to load products.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  if (!isAdmin) {
    return undefined;
  }

  let ignore = false;

  api
    .get('/products')
    .then((response) => {
      if (!ignore) {
        setProducts(response.data);
        setErrorMessage('');
      }
    })
    .catch((error) => {
      if (!ignore) {
        console.error(
          'Admin product loading error:',
          error
        );

        setErrorMessage(
          error.response?.data?.message ||
            'Unable to load products.'
        );
      }
    })
    .finally(() => {
      if (!ignore) {
        setIsLoading(false);
      }
    });

  return () => {
    ignore = true;
  };
}, [isAdmin]);

  const handleSubmit = async (
    values,
    formikHelpers
  ) => {
    try {
      const productData = {
        ...values,
        price: Number(values.price),
      };

      if (selectedProduct) {
        const response = await api.patch(
          `/products/${selectedProduct.id}`,
          productData,
          getAuthConfig()
        );

        showMessage(
          response.data.message ||
            'Product updated successfully',
          'success'
        );
      } else {
        const response = await api.post(
          '/products',
          productData,
          getAuthConfig()
        );

        showMessage(
          response.data.message ||
            'Product created successfully',
          'success'
        );
      }

      setSelectedProduct(null);
      formikHelpers.resetForm({
        values: emptyProduct,
      });

      await fetchProducts();
    } catch (error) {
      console.error(
        'Product submission error:',
        error
      );

      showMessage(
        error.response?.data?.message ||
          'Unable to save the product.',
        'danger'
      );
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCancelEdit = () => {
    setSelectedProduct(null);
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.delete(
        `/products/${product.id}`,
        getAuthConfig()
      );

      showMessage(
        response.data.message ||
          'Product deleted successfully',
        'success'
      );

      if (selectedProduct?.id === product.id) {
        setSelectedProduct(null);
      }

      await fetchProducts();
    } catch (error) {
      console.error(
        'Product deletion error:',
        error
      );

      showMessage(
        error.response?.data?.message ||
          'Unable to delete the product.',
        'danger'
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          Please <Link href="/login">log in</Link>{' '}
          to access product administration.
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          Administrator access is required.
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">
        Product Administration
      </h1>

      <div className="card mb-5">
        <div className="card-body">
          <h2 className="h4 mb-3">
            {selectedProduct
              ? `Edit ${selectedProduct.name}`
              : 'Create Product'}
          </h2>

          <Formik
            initialValues={
              selectedProduct
                ? {
                    name: selectedProduct.name,
                    price: selectedProduct.price,
                    imageUrl:
                      selectedProduct.imageUrl,
                    description:
                      selectedProduct.description,
                    category:
                      selectedProduct.category,
                  }
                : emptyProduct
            }
            enableReinitialize
            validationSchema={productSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, resetForm }) => (
              <Form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label
                      htmlFor="name"
                      className="form-label"
                    >
                      Product name
                    </label>

                    <Field
                      id="name"
                      name="name"
                      className="form-control"
                    />

                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label
                      htmlFor="price"
                      className="form-label"
                    >
                      Price
                    </label>

                    <Field
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                    />

                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="imageUrl"
                    className="form-label"
                  >
                    Image URL
                  </label>

                  <Field
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    className="form-control"
                  />

                  <ErrorMessage
                    name="imageUrl"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="description"
                    className="form-label"
                  >
                    Description
                  </label>

                  <Field
                    id="description"
                    name="description"
                    as="textarea"
                    rows="3"
                    className="form-control"
                  />

                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="category"
                    className="form-label"
                  >
                    Category
                  </label>

                  <Field
                    id="category"
                    name="category"
                    className="form-control"
                  />

                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Saving...'
                    : selectedProduct
                      ? 'Update Product'
                      : 'Create Product'}
                </button>

                {selectedProduct && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      handleCancelEdit();
                      resetForm({
                        values: emptyProduct,
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <h2 className="h3 mb-3">
        Existing Products
      </h2>

      {isLoading && <p>Loading products...</p>}

      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      )}

      {!isLoading &&
        !errorMessage &&
        products.length === 0 && (
          <div className="alert alert-info">
            No products are available.
          </div>
        )}

      {!isLoading &&
        !errorMessage &&
        products.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>

                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          width="70"
                          height="50"
                          className="me-3 object-fit-cover"
                        />

                        <div>
                          <strong>
                            {product.name}
                          </strong>

                          <div className="small text-muted">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>{product.category}</td>

                    <td>
                      ${product.price.toFixed(2)}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-warning me-2"
                        onClick={() =>
                          handleEdit(product)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          handleDelete(product)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}

export default AdminProductsPage;