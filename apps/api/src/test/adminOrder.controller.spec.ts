// import request from 'supertest';
// import express, { Express } from 'express';
// import OrderController from '../controllers/admin.order.controller';
// import OrderService from '../services/admin.order.service';

// jest.mock('../../services/admin.order.service');

// describe('OrderController', () => {
//   let app: Express;
//   let orderServiceMock: jest.Mocked<OrderService>;
//   let orderController: OrderController;

//   beforeEach(() => {
//     app = express();
//     app.use(express.json());
//     orderServiceMock = new OrderService() as jest.Mocked<OrderService>;
//     orderController = new OrderController();

//     // Assign the mocked service
//     (orderController as any).orderService = orderServiceMock;

//     app.get('/orders', (req, res) => orderController.getAllOrders(req, res));
//     app.post('/orders/confirm', (req, res) => orderController.confirmPayment(req, res));
//     app.post('/orders/send', (req, res) => orderController.sendOrder(req, res));
//     app.post('/orders/cancel', (req, res) => orderController.cancelOrder(req, res));
//   });

//   describe('getAllOrders', () => {
//     it('should return orders for STORE_ADMIN based on storeId', async () => {
//       const mockOrders = [{ id: 1, storeId: 2, status: 'WAITING_FOR_PAYMENT' }];
//       orderServiceMock.getAllOrders.mockResolvedValue(mockOrders);

//       const response = await request(app)
//         .get('/orders')
//         .set('Authorization', 'Bearer token') // Simulating authentication
//         .set('user', JSON.stringify({ id: 1, role: 'STORE_ADMIN', storeId: 2 }));

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(mockOrders);
//       expect(orderServiceMock.getAllOrders).toHaveBeenCalledWith(2);
//     });

//     it('should return all orders for SUPER_ADMIN', async () => {
//       const mockOrders = [{ id: 1, status: 'WAITING_FOR_PAYMENT' }];
//       orderServiceMock.getAllOrders.mockResolvedValue(mockOrders);

//       const response = await request(app)
//         .get('/orders')
//         .set('user', JSON.stringify({ id: 1, role: 'SUPER_ADMIN' }));

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(mockOrders);
//       expect(orderServiceMock.getAllOrders).toHaveBeenCalledWith(undefined);
//     });

//     it('should return 401 if no user is authenticated', async () => {
//       const response = await request(app).get('/orders');

//       expect(response.status).toBe(401);
//       expect(response.body).toEqual({ error: 'Unauthorized' });
//     });
//   });

//   describe('confirmPayment', () => {
//     it('should confirm payment and update order status', async () => {
//       const mockOrder = { id: 1, status: 'PROCESSING' };
//       orderServiceMock.confirmPayment.mockResolvedValue(mockOrder);

//       const response = await request(app)
//         .post('/orders/confirm')
//         .send({ orderId: 1, isAccepted: true });

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(mockOrder);
//       expect(orderServiceMock.confirmPayment).toHaveBeenCalledWith(1, true);
//     });

//     it('should return 400 for invalid input', async () => {
//       const response = await request(app)
//         .post('/orders/confirm')
//         .send({ orderId: 'invalid', isAccepted: 'wrong' });

//       expect(response.status).toBe(400);
//       expect(response.body).toEqual({ error: 'Invalid input' });
//     });

//     it('should handle service errors', async () => {
//       orderServiceMock.confirmPayment.mockRejectedValue(new Error('Order not found'));

//       const response = await request(app)
//         .post('/orders/confirm')
//         .send({ orderId: 99, isAccepted: true });

//       expect(response.status).toBe(400);
//       expect(response.body).toEqual({ error: 'Order not found' });
//     });
//   });

//   describe('sendOrder', () => {
//     it('should update order status to SHIPPED', async () => {
//       const mockOrder = { id: 1, status: 'SHIPPED' };
//       orderServiceMock.sendOrder.mockResolvedValue(mockOrder);

//       const response = await request(app)
//         .post('/orders/send')
//         .send({ orderId: 1 });

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(mockOrder);
//       expect(orderServiceMock.sendOrder).toHaveBeenCalledWith(1);
//     });

//     it('should return 400 for invalid orderId', async () => {
//       const response = await request(app)
//         .post('/orders/send')
//         .send({ orderId: 'invalid' });

//       expect(response.status).toBe(400);
//       expect(response.body).toEqual({ error: 'Invalid input' });
//     });

//     it('should handle errors when order is not found', async () => {
//       orderServiceMock.sendOrder.mockRejectedValue(new Error('Order cannot be shipped'));

//       const response = await request(app)
//         .post('/orders/send')
//         .send({ orderId: 99 });

//       expect(response.status).toBe(400);
//       expect(response.body).toEqual({ error: 'Order cannot be shipped' });
//     });
//   });

//   describe('cancelOrder', () => {
//     it('should cancel an order and update stock', async () => {
//       const mockOrder = { id: 1, status: 'CANCELLED' };
//       orderServiceMock.cancelOrder.mockResolvedValue(mockOrder);

//       const response = await request(app)
//         .post('/orders/cancel')
//         .set('user', JSON.stringify({ id: 123, role: 'SUPER_ADMIN' }))
//         .send({ orderId: 1 });

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(mockOrder);
//       expect(orderServiceMock.cancelOrder).toHaveBeenCalledWith(1, 123);
//     });

//     it('should return 400 for invalid orderId', async () => {
//       const response = await request(app)
//         .post('/orders/cancel')
//         .set('user', JSON.stringify({ id: 123, role: 'SUPER_ADMIN' }))
//         .send({ orderId: 'invalid' });

//       expect(response.status).toBe(400);
//       expect(response.body).toEqual({ error: 'Invalid input' });
//     });

//     it('should return 401 if user is not authenticated', async () => {
//       const response = await request(app)
//         .post('/orders/cancel')
//         .send({ orderId: 1 });

//       expect(response.status).toBe(401);
//       expect(response.body).toEqual({ error: 'Unauthorized' });
//     });

//     it('should handle errors if order cannot be cancelled', async () => {
//       orderServiceMock.cancelOrder.mockRejectedValue(new Error('Cannot cancel order at this status'));

//       const response = await request(app)
//         .post('/orders/cancel')
//         .set('user', JSON.stringify({ id: 123, role: 'SUPER_ADMIN' }))
//         .send({ orderId: 1 });

//       expect(response.status).toBe(400);
//       expect(response.body).toEqual({ error: 'Cannot cancel order at this status' });
//     });
//   });
// });