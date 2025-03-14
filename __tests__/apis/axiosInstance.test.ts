import MockAdapter from "axios-mock-adapter";
import axiosInstance from "@/apis/axiosInstance";
import { AxiosError } from "axios";

describe("axiosInstance", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should make successful GET request", async () => {
    const mockData = { message: "성공" };
    mock.onGet("/test").reply(200, mockData);

    const response = await axiosInstance.get("/test");
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockData);
  });

  it("should handle error responses", async () => {
    mock.onGet("/error").reply(404, { message: "찾을 수 없음" });

    try {
      await axiosInstance.get("/error");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      expect(axiosError.response?.status).toBe(404);
      expect(axiosError.response?.data.message).toBe("찾을 수 없음");
    }
  });

  it("should include correct headers", async () => {
    mock.onGet("/headers-test").reply((config) => {
      expect(config.headers?.["Content-Type"]).toBe("application/json");
      return [200, {}];
    });

    await axiosInstance.get("/headers-test");
  });
});
