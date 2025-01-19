// import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import { OrderController } from "../controllers/order.controller";
// import { OrderService } from "../services/order.service";

// // 1) Mock the OrderService methods
// jest.mock("../services/order.service", () => {
//   return {
//     OrderService: jest.fn().mockImplementation(() => {
//       return {
//         createOrder: jest.fn(),
//         uploadPaymentProof: jest.fn(),
//       };
//     }),
//   };
// });

// // 2) Create mocks for jwt.verify so we can control token behavior
// jest.mock("jsonwebtoken", () => ({
//   ...jest.requireActual("jsonwebtoken"),
//   verify: jest.fn(),
// }));

// // 3) A helper to build mock Request and Response objects
// const mockRequest = (body: any, headers: any = {}): Partial<Request> => {
//   return {
//     body,
//     headers,
//     // Provide a partial implementation of headers.authorization
//     // if we want something like "Bearer <token>"
//   };
// };

// const mockResponse = (): Partial<Response> => {
//   const res: Partial<Response> = {};
//   res.status = jest.fn().mockReturnValue(res);
//   res.json = jest.fn().mockReturnValue(res);
//   return res;
// };

// describe("OrderController", () => {
//   let orderServiceMock: any; // We'll store the mocked service here
//   const TEST_USER_ID = 123;  // Example userId from decoded token

//   beforeEach(() => {
//     // Clear all mocks before each test
//     jest.clearAllMocks();

//     // Re-instantiate the mock so we have fresh spy references
//     orderServiceMock = new OrderService();
//   });

//   // ---------------------------
//   // getUserIdFromToken tests
//   // ---------------------------
//   describe("getUserIdFromToken", () => {
//     it("should throw an error if no token is provided", () => {
//       const req = mockRequest({}, {}) as Request; // no headers.authorization
//       expect(() => {
//         OrderController.getUserIdFromToken(req);
//       }).toThrow("Authorization token is missing");
//     });

//     it("should throw an error if token has no userId", () => {
//       (jwt.verify as jest.Mock).mockReturnValue({}); // No userId property
//       const req = mockRequest({}, { authorization: "Bearer someToken" }) as Request;
//       expect(() => {
//         OrderController.getUserIdFromToken(req);
//       }).toThrow("Invalid token");
//     });

//     it("should return userId if token is valid", () => {
//       (jwt.verify as jest.Mock).mockReturnValue({ userId: TEST_USER_ID });
//       const req = mockRequest({}, { authorization: "Bearer someToken" }) as Request;

//       const userId = OrderController.getUserIdFromToken(req);
//       expect(userId).toBe(TEST_USER_ID);
//       expect(jwt.verify).toHaveBeenCalledTimes(1);
//     });
//   });

//   // ---------------------------
//   // createOrder tests
//   // ---------------------------
//   describe("createOrder", () => {
//     it("should create a new order and return success", async () => {
//       // Mock decoded token
//       (jwt.verify as jest.Mock).mockReturnValue({ userId: TEST_USER_ID });

//       // Mock request data (must match zod schema with correct data types)
//       const req = mockRequest({
//         storeId: 2,
//         shippingAddressId: 10,
//         shippingMethod: "REGULAR",
//         paymentMethod: "TRANSFER",
//         items: [
//           { productId: 99, quantity: 2 },
//         ],
//       }, { authorization: "Bearer validToken" }) as Request;

//       const res = mockResponse() as Response;

//       // Mock the createOrder service response
//       const mockOrder = { id: 1, userId: TEST_USER_ID };
//       orderServiceMock.createOrder.mockResolvedValue(mockOrder);

//       await OrderController.createOrder(req, res);

//       // Check that service was called with correct arguments
//       expect(orderServiceMock.createOrder).toHaveBeenCalledWith(
//         TEST_USER_ID,
//         2,
//         10,
//         "REGULAR",
//         "TRANSFER",
//         [
//           { productId: 99, quantity: 2 },
//         ]
//       );

//       // Check response
//       expect(res.json).toHaveBeenCalledWith({
//         success: true,
//         data: mockOrder,
//       });
//     });

//     it("should return a 400 error if Zod validation fails", async () => {
//       (jwt.verify as jest.Mock).mockReturnValue({ userId: TEST_USER_ID });
      
//       // Missing `items` field or invalid data to trigger zod error
//       const req = mockRequest({
//         storeId: 2,
//         shippingAddressId: 10,
//         shippingMethod: "REGULAR",
//         paymentMethod: "TRANSFER",
//         items: [], // empty array => triggers "At least one order item required"
//       }, { authorization: "Bearer validToken" }) as Request;

//       const res = mockResponse() as Response;

//       await OrderController.createOrder(req, res);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({
//           success: false,
//           error: "Validation Error",
//           issues: expect.any(Array),
//         })
//       );
//     });

//     it("should return a 400 error if the service throws an error", async () => {
//       (jwt.verify as jest.Mock).mockReturnValue({ userId: TEST_USER_ID });

//       // Valid data
//       const req = mockRequest({
//         storeId: 2,
//         shippingAddressId: 10,
//         shippingMethod: "REGULAR",
//         paymentMethod: "TRANSFER",
//         items: [{ productId: 99, quantity: 2 }],
//       }, { authorization: "Bearer validToken" }) as Request;

//       const res = mockResponse() as Response;

//       // Force the service to throw
//       const errorMessage = "Some error from the service";
//       orderServiceMock.createOrder.mockRejectedValue(new Error(errorMessage));

//       await OrderController.createOrder(req, res);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({
//         success: false,
//         error: errorMessage,
//       });
//     });
//   });

//   // ---------------------------
//   // uploadPaymentProof tests
//   // ---------------------------
//   describe("uploadPaymentProof", () => {
//     it("should upload payment proof successfully", async () => {
//       (jwt.verify as jest.Mock).mockReturnValue({ userId: TEST_USER_ID });

//       // Mock request body
//       const req = mockRequest(
//         { orderId: 1 },
//         { authorization: "Bearer validToken" }
//       ) as Request;

//       // We need to mock `file` property on the request
//       (req as any).file = { path: "/path/to/fakefile.jpg" };

//       const res = mockResponse() as Response;

//       // Mock the service response
//       const mockUpdatedOrder = { id: 1, userId: TEST_USER_ID, paymentProof: "some-url" };
//       orderServiceMock.uploadPaymentProof.mockResolvedValue(mockUpdatedOrder);

//       await OrderController.uploadPaymentProof(req, res);

//       expect(orderServiceMock.uploadPaymentProof).toHaveBeenCalledWith(
//         TEST_USER_ID,
//         1, // orderId
//         "/path/to/fakefile.jpg"
//       );

//       expect(res.json).toHaveBeenCalledWith({
//         success: true,
//         data: mockUpdatedOrder,
//       });
//     });

//     it("should return 400 if file is missing", async () => {
//       (jwt.verify as jest.Mock).mockReturnValue({ userId: TEST_USER_ID });

//       // No `file` property
//       const req = mockRequest(
//         { orderId: 1 },
//         { authorization: "Bearer validToken" }
//       ) as Request;

//       const res = mockResponse() as Response;

//       await OrderController.uploadPaymentProof(req, res);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({
//         success: false,
//         error: "No file attached in request",
//       });
//     });

//     it("should return 400 if zod validation fails (e.g. orderId < 1)", async () => {
//       (jwt.verify as jest.Mock).mockReturnValue({ userId: TEST_USER_ID });

//       // orderId <= 0 will fail .min(1) from zod
//       const req = mockRequest(
//         { orderId: 0 },
//         { authorization: "Bearer validToken" }
//       ) as Request;
//       (req as any).file = { path: "/path/to/fakefile.jpg" };

//       const res = mockResponse() as Response;

//       await OrderController.uploadPaymentProof(req, res);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({
//           success: false,
//           error: "Validation Error",
//           issues: expect.any(Array),
//         })
//       );
//     });

//     it("should return 400 if service throws error", async () => {
//       (jwt.verify as jest.Mock).mockReturnValue({ userId: TEST_USER_ID });

//       const req = mockRequest(
//         { orderId: 10 },
//         { authorization: "Bearer validToken" }
//       ) as Request;
//       (req as any).file = { path: "/path/to/fakefile.jpg" };

//       const res = mockResponse() as Response;

//       orderServiceMock.uploadPaymentProof.mockRejectedValue(
//         new Error("Some upload error")
//       );

//       await OrderController.uploadPaymentProof(req, res);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({
//         success: false,
//         error: "Some upload error",
//       });
//     });
//   });
// });