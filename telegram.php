<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $botToken = '8112921007:AAHvjM0SWYMZDh3xucPLMMfKyPmZ7TYfztY';
    $chatIds = ['1049514305']; // Добавьте сюда другие chat ID через запятую
    
    $message = "📞 Новая заявка на выкуп авто:\n\n";
    $message .= "🚗 Марка: " . $data['brand'] . "\n";
    $message .= "🔧 Модель: " . $data['model'] . "\n";
    $message .= "📅 Год: " . $data['year'] . "\n";
    $message .= "💰 Желаемая цена: " . $data['price'] . " руб.\n";
    $message .= "👤 Имя: " . $data['name'] . "\n";
    $message .= "📱 Телефон: " . $data['phone'];
    
    $success = false;
    
    foreach ($chatIds as $chatId) {
        if (!empty($chatId)) {
            $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
            $postData = [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML'
            ];
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            
            $result = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode === 200) {
                $success = true;
            }
        }
    }
    
    echo json_encode(['success' => $success]);
    exit;
}
?>