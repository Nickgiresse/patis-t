import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Admin signup
app.post('/make-server-8a0a902e/admin/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      email_confirm: true // Automatically confirm email since email server hasn't been configured
    });

    if (error) {
      console.log('Error creating admin user during signup:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Error in admin signup route:', error);
    return c.json({ error: 'Internal server error during admin signup' }, 500);
  }
});

// Get categories
app.get('/make-server-8a0a902e/categories', async (c) => {
  try {
    const categories = await kv.getByPrefix('category:');
    const categoryList = categories.map(cat => cat.value).filter(cat => cat !== null && cat !== undefined);
    console.log('Fetched categories:', categoryList);
    return c.json({ categories: categoryList });
  } catch (error) {
    console.log('Error fetching categories:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

// Add category (admin only)
app.post('/make-server-8a0a902e/categories', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      console.log('Unauthorized access to add category:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name } = await c.req.json();
    const timestamp = Date.now();
    const categoryKey = `category:${timestamp}`;
    const categoryId = `cat_${timestamp}`;
    
    const category = {
      id: categoryId,
      name,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(categoryKey, category);
    
    console.log('Category added successfully:', category);
    return c.json({ success: true, category });
  } catch (error) {
    console.log('Error adding category:', error);
    return c.json({ error: 'Failed to add category' }, 500);
  }
});

// Get products
app.get('/make-server-8a0a902e/products', async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    return c.json({ products: products.map(p => p.value) });
  } catch (error) {
    console.log('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Add product (admin only)
app.post('/make-server-8a0a902e/products', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      console.log('Unauthorized access to add product:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, description, price, image, category } = await c.req.json();
    const timestamp = Date.now();
    const productKey = `product:${timestamp}`;
    const productId = `prod_${timestamp}`;
    
    const product = {
      id: productId,
      name,
      description: description || '',
      price: parseFloat(price),
      image: image || '',
      category,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(productKey, product);
    
    console.log('Product added successfully:', product);
    return c.json({ success: true, product });
  } catch (error) {
    console.log('Error adding product:', error);
    return c.json({ error: 'Failed to add product' }, 500);
  }
});

// Delete product (admin only)
app.delete('/make-server-8a0a902e/products/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      console.log('Unauthorized access to delete product:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const productId = c.req.param('id');
    await kv.del(productId);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting product:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// Save order
app.post('/make-server-8a0a902e/orders', async (c) => {
  try {
    const orderData = await c.req.json();
    const orderId = `order:${Date.now()}`;
    
    const order = {
      id: orderId,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    await kv.set(orderId, order);
    
    return c.json({ success: true, order });
  } catch (error) {
    console.log('Error saving order:', error);
    return c.json({ error: 'Failed to save order' }, 500);
  }
});

// Get orders (admin only)
app.get('/make-server-8a0a902e/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      console.log('Unauthorized access to view orders:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const orders = await kv.getByPrefix('order:');
    return c.json({ orders: orders.map(o => o.value).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) });
  } catch (error) {
    console.log('Error fetching orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

Deno.serve(app.fetch);
