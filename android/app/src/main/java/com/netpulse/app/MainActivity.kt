package com.netpulse.app

import android.net.TrafficStats
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.TextView
import com.getcapacitor.BridgeActivity
import java.util.Locale

class MainActivity : BridgeActivity() {

    private lateinit var downloadSpeedTextView: TextView
    private lateinit var uploadSpeedTextView: TextView

    private var lastRxBytes: Long = 0
    private var lastTxBytes: Long = 0
    private var lastTime: Long = 0

    private val handler = Handler(Looper.getMainLooper())
    private val speedMonitorRunnable = object : Runnable {
        override fun run() {
            calculateSpeed()
            handler.postDelayed(this, 1000)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Note: BridgeActivity handles setContentView(R.layout.activity_main) internally if it exists
        // but we might need to manually find views after it's initialized.
        // In Capacitor, BridgeActivity usually sets up the WebView.
        
        // We can find our views after the super.onCreate
        downloadSpeedTextView = findViewById(R.id.downloadSpeedTextView)
        uploadSpeedTextView = findViewById(R.id.uploadSpeedTextView)

        lastRxBytes = TrafficStats.getTotalRxBytes()
        lastTxBytes = TrafficStats.getTotalTxBytes()
        lastTime = System.currentTimeMillis()

        startMonitoring()
    }

    private fun startMonitoring() {
        handler.post(speedMonitorRunnable)
    }

    private fun stopMonitoring() {
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
        val rxSpeed = (rxDiff / timeDiff).toLong()
        val txSpeed = (txDiff / timeDiff).toLong()

        updateUI(rxSpeed, txSpeed)

        lastRxBytes = currentRxBytes
        lastTxBytes = currentTxBytes
        lastTime = currentTime
    }

    private fun updateUI(rxSpeed: Long, txSpeed: Long) {
        downloadSpeedTextView.text = String.format(Locale.getDefault(), "Download: %s", formatSpeed(rxSpeed))
        uploadSpeedTextView.text = String.format(Locale.getDefault(), "Upload: %s", formatSpeed(txSpeed))
    }

    private fun formatSpeed(bytesPerSecond: Long): String {
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
