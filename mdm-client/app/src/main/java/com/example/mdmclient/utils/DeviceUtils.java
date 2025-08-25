package com.example.mdmclient.utils;

import android.content.Context;
import android.os.Build;
import android.provider.Settings;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class DeviceUtils {
    public static String getIPAddress() {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface networkInterface : interfaces) {
                List<InetAddress> addresses = Collections.list(networkInterface.getInetAddresses());
                for (InetAddress address : addresses) {
                    if (!address.isLoopbackAddress() && address instanceof java.net.Inet4Address) {
                        return address.getHostAddress();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String getMacAddress() {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface networkInterface : interfaces) {
                byte[] mac = networkInterface.getHardwareAddress();
                if (mac != null) {
                    StringBuilder macAddress = new StringBuilder();
                    for (byte b : mac) {
                        macAddress.append(String.format("%02X:", b));
                    }
                    if (macAddress.length() > 0) {
                        macAddress.deleteCharAt(macAddress.length() - 1); // Remove trailing colon
                    }
                    return macAddress.toString();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null; // Return null if no MAC address is found
    }

    public static String getDeviceSerial(Context context) {
        String serial = null;

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Android 10 及以上，无法直接获取序列号
                serial = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                // Android 8.0 及以上，使用 Build.getSerial()
                serial = Build.getSerial();
            } else {
                // Android 8.0 以下，使用 Build.SERIAL
                serial = Build.SERIAL;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 如果序列号为空，使用备选方案
        if (serial == null || serial.isEmpty()) {
            serial = UUID.randomUUID().toString();
        }

        return serial;
    }
}
