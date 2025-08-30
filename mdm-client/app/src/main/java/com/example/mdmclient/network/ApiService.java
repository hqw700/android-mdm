package com.example.mdmclient.network;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {
    @POST("api/devices/register/")
    Call<DeviceRegisterResponse> registerDevice(@Body DeviceRegisterRequest request);

    @GET("api/devices/{device_id}/")
    Call<ResponseBody> getDevice(@Path("device_id") String deviceId);
}
