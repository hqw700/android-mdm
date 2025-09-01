package com.example.mdmclient;

import android.Manifest;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.mdmclient.BuildConfig;
import com.example.mdmclient.network.ApiService;
import com.example.mdmclient.network.DeviceRegisterRequest;
import com.example.mdmclient.network.DeviceRegisterResponse;
import com.example.mdmclient.network.WebSocketManager;
import com.example.mdmclient.utils.DeviceUtils;

import org.jetbrains.annotations.NotNull;
import org.json.JSONException;
import org.json.JSONObject;

import cn.jpush.android.api.JPushInterface;
import okhttp3.Response;
import okhttp3.ResponseBody;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.moshi.MoshiConverterFactory;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "mdm-main";

    private static final int ADMIN_REQUEST_CODE = 1;
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 2;
    private DevicePolicyManager devicePolicyManager;
    private ComponentName componentName;
    private ApiService apiService;
    private WebSocketManager webSocketManager;

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

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, LOCATION_PERMISSION_REQUEST_CODE);
        }

        devicePolicyManager = (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
        componentName = new ComponentName(this, MyDeviceAdminReceiver.class);

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BuildConfig.API_BASE_URL)
                .addConverterFactory(MoshiConverterFactory.create())
                .build();
        apiService = retrofit.create(ApiService.class);

        TextView textView = findViewById(R.id.textView);

        textView.setText("RegistrationID: " +  JPushInterface.getRegistrationID(this));
        Log.d(TAG, "RegistrationID: " + JPushInterface.getRegistrationID(this));

        // 检查是否已激活设备管理员权限
        if (!devicePolicyManager.isAdminActive(componentName)) {
            requestDeviceAdmin();
        } else {
            // 权限已激活，可以进行设备注册
            checkDeviceRegistration();
        }
    }

    private void startWebSocket() {
        String deviceId = DeviceUtils.getDeviceSerial(this);
        String wsUrl = BuildConfig.API_BASE_URL.replace("http", "ws") + "ws/devices/" + deviceId + "/";
        webSocketManager = new WebSocketManager(wsUrl, new WebSocketListener() {
            @Override
            public void onOpen(@NotNull WebSocket webSocket, @NotNull Response response) {
                super.onOpen(webSocket, response);
                Log.d(TAG, "WebSocket opened");
            }

            @Override
            public void onMessage(@NotNull WebSocket webSocket, @NotNull String text) {
                super.onMessage(webSocket, text);
                Log.d(TAG, "WebSocket onMessage: " + text);
                try {
                    JSONObject json = new JSONObject(text);
                    String command = json.optString("command");
                    handleCommand(command);
                } catch (JSONException e) {
                    Log.e(TAG, "Failed to parse command", e);
                }
            }

            @Override
            public void onClosed(@NotNull WebSocket webSocket, int code, @NotNull String reason) {
                super.onClosed(webSocket, code, reason);
                Log.d(TAG, "WebSocket closed");
            }

            @Override
            public void onFailure(@NotNull WebSocket webSocket, @NotNull Throwable t, @NotNull Response response) {
                super.onFailure(webSocket, t, response);
                Log.e(TAG, "WebSocket failure", t);
            }
        });
        webSocketManager.start();
    }

    private void handleCommand(String command) {
        if (command == null) return;

        switch (command) {
            case "lock":
                Log.i(TAG, "Executing lock command");
                devicePolicyManager.lockNow();
                break;
            case "disable_camera":
                Log.i(TAG, "Executing disable_camera command");
                devicePolicyManager.setCameraDisabled(componentName, true);
                break;
            case "enable_camera":
                Log.i(TAG, "Executing enable_camera command");
                devicePolicyManager.setCameraDisabled(componentName, false);
                break;
            case "get_location":
                Log.i(TAG, "Executing get_location command");
                requestLocation();
                break;
            default:
                Log.w(TAG, "Unknown command: " + command);
                break;
        }
    }

    private void requestLocation() {

        sendLocation();
    }

    private void sendLocation() {
        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            Log.e(TAG, "sendLocation: 无定位权限");
            return;
        }
        Location location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        if (location == null) {
            location = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
        }
        if (location == null) {
            location = locationManager.getLastKnownLocation(LocationManager.PASSIVE_PROVIDER);
        }
        if (location != null && webSocketManager != null) {
            JSONObject locationJson = new JSONObject();
            try {
                locationJson.put("type", "location_update");
                locationJson.put("latitude", location.getLatitude());
                locationJson.put("longitude", location.getLongitude());
                webSocketManager.sendMessage(locationJson.toString());
            } catch (JSONException e) {
                Log.e(TAG, "Failed to create location JSON", e);
            }
        } else {
            Log.e(TAG, "sendLocation: 无法获取位置:" + (location == null)
                    + ", 或WebSocket未连接: " + (webSocketManager == null));
            JSONObject locationJson = new JSONObject();
            try {
                locationJson.put("type", "location_update");
                locationJson.put("latitude", "22.2");
                locationJson.put("longitude", "33.3");
                webSocketManager.sendMessage(locationJson.toString());
            } catch (JSONException e) {
                Log.e(TAG, "Failed to create location JSON", e);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                sendLocation();
            } else {
                Toast.makeText(this, "Location permission denied", Toast.LENGTH_SHORT).show();
            }
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
                checkDeviceRegistration();
            } else {
                // 用户拒绝授予权限，可以提示用户或退出应用
                Toast.makeText(this, "未授予权限，部分功能不可用", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void checkDeviceRegistration() {
        String deviceId = DeviceUtils.getDeviceSerial(this);
        apiService.getDevice(deviceId).enqueue(new Callback<ResponseBody>() {

            @Override
            public void onResponse(Call<ResponseBody> call, retrofit2.Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    // 200 OK, device is already registered
                    Toast.makeText(MainActivity.this, "设备已注册", Toast.LENGTH_LONG).show();
                    startWebSocket();
                } else if (response.code() == 404) {
                    // 404 Not Found, device is not registered
                    registerDevice();
                } else {
                    Toast.makeText(MainActivity.this, "检查设备状态失败: " + response.code(), Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(MainActivity.this, "检查设备状态失败: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    // 设备注册方法，将在第4步实现
    private void registerDevice() {
        // 获取设备唯一标识，这里使用Build.SERIAL来模拟，在实际应用中要谨慎
        String device_id = DeviceUtils.getDeviceSerial(this);
        String deviceName = Build.DEVICE;
        String push_token = JPushInterface.getRegistrationID(this);
        String model = Build.MODEL;
        String ip_addr = DeviceUtils.getIPAddress();
        String mac_addr = DeviceUtils.getMacAddress();
        String os_version = Build.VERSION.RELEASE;
        String software_version = "1.0.0";
        //String device_id, String name, String fcm_token, String model, String ip_address,
        // String mac_address, String os_version, String software_version
        DeviceRegisterRequest request = new DeviceRegisterRequest(device_id, deviceName, push_token,
                model, ip_addr, mac_addr, os_version, software_version);

        // 使用异步任务来执行网络请求
        apiService.registerDevice(request).enqueue(new Callback<DeviceRegisterResponse>() {

            @Override
            public void onResponse(Call<DeviceRegisterResponse> call, retrofit2.Response<DeviceRegisterResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Log.d(TAG, "onResponse: " + response.message());
                    // 注册成功，可以保存设备ID到本地
                    Toast.makeText(MainActivity.this, "注册成功: " + response.message(), Toast.LENGTH_LONG).show();
                    startWebSocket();
                } else {
                    Log.d(TAG, "onResponse: " + response.code());
                    Toast.makeText(MainActivity.this, "注册失败: " + response.code(), Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<DeviceRegisterResponse> call, Throwable t) {
                Log.d(TAG, "onFailure: " + t.getMessage());
                Toast.makeText(MainActivity.this, "注册失败: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (webSocketManager != null) {
            webSocketManager.stop();
        }
    }
}