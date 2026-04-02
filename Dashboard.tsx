import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

interface SpeedTestResult {
    download: number;
    upload: number;
    ping: number;
    timestamp: Date;
}

const Dashboard: React.FC = () => {
    const [testResults, setTestResults] = useState<SpeedTestResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [currentResult, setCurrentResult] = useState<SpeedTestResult | null>(null);

    const fetchSpeedTest = async () => {
        setLoading(true);
        setProgress(0);
        // Speed test using Cloudflare API
        const startTest = Date.now();
        const response = await fetch('https://api.cloudflare.com/speed-test');
        const data = await response.json();

        const endTest = Date.now();
        const download = data.downloadSpeed;
        const upload = data.uploadSpeed;
        const ping = data.ping;

        const result: SpeedTestResult = {
            download,
            upload,
            ping,
            timestamp: new Date(),
        };

        setTestResults([...testResults, result]);
        setCurrentResult(result);
        setLoading(false);
        setProgress(100);
    };

    const handleExportCSV = () => {
        const csvContent = 'data:text/csv;charset=utf-8,Timestamp,Download,Upload,Ping\n' + 
            testResults.map(e => `${e.timestamp},${e.download},${e.upload},${e.ping}`).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'speed_test_results.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const chartData = {
        labels: testResults.map(result => result.timestamp.toString()),
        datasets: [
            {
                label: 'Download Speed (Mbps)',
                data: testResults.map(result => result.download),
                borderColor: 'blue',
                fill: false,
            },
            {
                label: 'Upload Speed (Mbps)',
                data: testResults.map(result => result.upload),
                borderColor: 'green',
                fill: false,
            },
        ],
    };

    return (
        <div>
            <h1>Speed Test Dashboard</h1>
            <button onClick={fetchSpeedTest} disabled={loading}>Run Speed Test</button>
            {loading && <p>Testing... {progress}%</p>}
            {currentResult && (
                <button onClick={() => setShowModal(true)}>View Test Details</button>
            )}
            <button onClick={handleExportCSV}>Export as CSV</button>
            <Line data={chartData} />
            {showModal && currentResult && (
                <div className='modal'>
                    <h2>Test Details</h2>
                    <p>Download: {currentResult.download} Mbps</p>
                    <p>Upload: {currentResult.upload} Mbps</p>
                    <p>Ping: {currentResult.ping} ms</p>
                    <button onClick={() => setShowModal(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;