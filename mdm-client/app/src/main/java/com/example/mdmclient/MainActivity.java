package com.example.mdmclient;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.mdmclient.network.ApiService;
import com.example.mdmclient.network.DeviceRegisterRequest;
import com.example.mdmclient.network.DeviceRegisterResponse;
import com.example.mdmclient.utils.DeviceUtils;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.moshi.MoshiConverterFactory;

public class MainActivity extends AppCompatActivity {



    private static final int ADMIN_REQUEST_CODE = 1;
    private DevicePolicyManager devicePolicyManager;
    private ComponentName componentName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        devicePolicyManager = (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
        componentName = new ComponentName(this, MyDeviceAdminReceiver.class);

        // 检查是否已激活设备管理员权限
        if (!devicePolicyManager.isAdminActive(componentName)) {
            requestDeviceAdmin();
        } else {
            // 权限已激活，可以进行设备注册
            registerDevice();
        }
    }

    private void requestDeviceAdmin() {
        Intent intent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
        intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName);
        intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "请激活设备管理员权限，以实现企业管理功能。");
        startActivityForResult(intent, ADMIN_REQUEST_CODE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == ADMIN_REQUEST_CODE) {
            if (resultCode == RESULT_OK) {
                // 用户已授予权限，可以进行设备注册
                registerDevice();
            } else {
                // 用户拒绝授予权限，可以提示用户或退出应用
                Toast.makeText(this, "未授予权限，部分功能不可用", Toast.LENGTH_SHORT).show();
            }
        }
    }

    // 设备注册方法，将在第4步实现
    private void registerDevice() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://192.168.5.9:8000/")
                .addConverterFactory(MoshiConverterFactory.create())
                .build();

        ApiService apiService = retrofit.create(ApiService.class);

        // 获取设备唯一标识，这里使用Build.SERIAL来模拟，在实际应用中要谨慎
        String device_id = DeviceUtils.getDeviceSerial(this);
        String deviceName = Build.BRAND;
        String fcm_token = "token";
        String model = Build.MODEL;
        String ip_addr = DeviceUtils.getIPAddress();
        String mac_addr = DeviceUtils.getMacAddress();
        String os_version = Build.VERSION.RELEASE;
        String software_version = "1.0.0";
        //String device_id, String name, String fcm_token, String model, String ip_address,
        // String mac_address, String os_version, String software_version
        DeviceRegisterRequest request = new DeviceRegisterRequest(device_id, deviceName, fcm_token,
                model, ip_addr, mac_addr, os_version, software_version);

        // 使用异步任务来执行网络请求
        apiService.registerDevice(request).enqueue(new Callback<DeviceRegisterResponse>() {
            @Override
            public void onResponse(Call<DeviceRegisterResponse> call, Response<DeviceRegisterResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Log.d("huangqw2", "onResponse: " + response.body().message);
                    // 注册成功，可以保存设备ID到本地
                    Toast.makeText(MainActivity.this, "注册成功: " + response.body().message, Toast.LENGTH_LONG).show();
                } else {
                    Log.d("huangqw2", "onResponse: " + response.code());
                    Toast.makeText(MainActivity.this, "注册失败: " + response.code(), Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<DeviceRegisterResponse> call, Throwable t) {
                Log.d("huangqw2", "onFailure: " + t.getMessage());
                Toast.makeText(MainActivity.this, "注册失败: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

}