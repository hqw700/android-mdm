package com.example.mdmclient.network;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface ApiService {
    @POST("api/devices/register/")
    Call<DeviceRegisterResponse> registerDevice(@Body DeviceRegisterRequest request);
}
