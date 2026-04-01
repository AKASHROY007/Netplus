package com.netpulse.app

import android.net.TrafficStats
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.TextView
import com.getcapacitor.BridgeActivity
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.util.Locale
import kotlin.math.abs

class MainActivity : BridgeActivity() {

    private lateinit var downloadSpeedTextView: TextView
    private lateinit var uploadSpeedTextView: TextView

    private var lastRxBytes: Long = 0
    private var lastTxBytes: Long = 0
    private var lastTime: Long = 0
    
    private var currentPing: Long = 0
    private var currentJitter: Long = 0
    private var lastPing: Long = -1

    private val handler = Handler(Looper.getMainLooper())
    private var isMonitoring = false

    private val speedMonitorRunnable = object : Runnable {
        override fun run() {
            if (isMonitoring) {
                calculateSpeed()
                handler.postDelayed(this, 1000)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Find views defined in activity_main.xml
        downloadSpeedTextView = findViewById(R.id.downloadSpeedTextView)
        uploadSpeedTextView = findViewById(R.id.uploadSpeedTextView)

        lastRxBytes = TrafficStats.getTotalRxBytes()
        lastTxBytes = TrafficStats.getTotalTxBytes()
        lastTime = System.currentTimeMillis()
    }

    private fun startMonitoring() {
        if (isMonitoring) return
        isMonitoring = true
        handler.post(speedMonitorRunnable)
        startPingMonitoring()
    }

    private fun stopMonitoring() {
        isMonitoring = false
        handler.removeCallbacks(speedMonitorRunnable)
    }

    private fun calculateSpeed() {
        val currentRxBytes = TrafficStats.getTotalRxBytes()
        val currentTxBytes = TrafficStats.getTotalTxBytes()
        val currentTime = System.currentTimeMillis()

        val timeDiff = (currentTime - lastTime) / 1000.0 // in seconds
        if (timeDiff <= 0) return

        val rxDiff = currentRxBytes - lastRxBytes
        val txDiff = currentTxBytes - lastTxBytes

        // Speed in bytes per second
        val rxSpeed = if (rxDiff > 0) (rxDiff / timeDiff).toLong() else 0L
        val txSpeed = if (txDiff > 0) (txDiff / timeDiff).toLong() else 0L

        updateUI(rxSpeed, txSpeed)

        lastRxBytes = currentRxBytes
        lastTxBytes = currentTxBytes
        lastTime = currentTime
    }

    private fun startPingMonitoring() {
        Thread {
            while (isMonitoring) {
                val ping = measurePing()
                if (ping != -1L) {
                    if (lastPing != -1L) {
                        currentJitter = abs(ping - lastPing)
                    }
                    currentPing = ping
                    lastPing = ping
                }
                try {
                    Thread.sleep(1000)
                } catch (e: InterruptedException) {
                    break
                }
            }
        }.start()
    }

    private fun measurePing(): Long {
        val startTime = System.currentTimeMillis()
        return try {
            // Using a reliable server for ping measurement via HTTP connection
            val url = URL("https://www.google.com")
            val connection = url.openConnection() as HttpURLConnection
            connection.connectTimeout = 1000
            connection.readTimeout = 1000
            connection.useCaches = false
            connection.connect()
            val endTime = System.currentTimeMillis()
            connection.disconnect()
            endTime - startTime
        } catch (e: IOException) {
            -1
        }
    }

    private fun updateUI(rxSpeed: Long, txSpeed: Long) {
        // Convert to Mbps for the WebView graphs
        val rxSpeedMbps = (rxSpeed * 8) / 1000000.0
        val txSpeedMbps = (txSpeed * 8) / 1000000.0

        // Appending Ping and Jitter to existing TextViews as per UI constraints
        val downloadText = String.format(Locale.getDefault(), "Download: %s | Ping: %d ms", formatSpeed(rxSpeed), currentPing)
        val uploadText = String.format(Locale.getDefault(), "Upload: %s | Jitter: %d ms", formatSpeed(txSpeed), currentJitter)
        
        handler.post {
            downloadSpeedTextView.text = downloadText
            uploadSpeedTextView.text = uploadText
            
            // Send real-time data to WebView for graphs
            val json = String.format(Locale.US, "{\"download\": %.2f, \"upload\": %.2f, \"ping\": %d, \"jitter\": %d}", 
                rxSpeedMbps, txSpeedMbps, currentPing, currentJitter)
            bridge.triggerWindowEvent("networkUpdate", json)
        }
    }

    private fun formatSpeed(bytesPerSecond: Long): String {
        // Convert to bits for Mbps/Kbps as per common standards
        val bitsPerSecond = bytesPerSecond * 8
        return when {
            bitsPerSecond >= 1000000 -> String.format(Locale.getDefault(), "%.2f Mbps", bitsPerSecond / 1000000.0)
            bitsPerSecond >= 1000 -> String.format(Locale.getDefault(), "%.2f Kbps", bitsPerSecond / 1000.0)
            else -> String.format(Locale.getDefault(), "%d bps", bitsPerSecond)
        }
    }

    override fun onResume() {
        super.onResume()
        startMonitoring()
    }

    override fun onPause() {
        super.onPause()
        stopMonitoring()
    }
}
