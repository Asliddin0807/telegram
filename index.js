const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const mas = require('./base')
const korzinka = require('./korzinka')
const token = '6516411920:AAFJV9gmaRhUIL4NOi7OQrEN7MO42bOtCKY';
const webAppUrl = 'https://ornate-selkie-c27577.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    if(text === '/start') {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl + '/form'}}]
                ]
            },
            
        })

        await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
                reply_markup: {
                    keyboard: [
                        ['Сделать Заказ!'], // Первый ряд кнопок
                        ['Регистрация'],
                        ['Корзинка'] 
                    ],
                    resize_keyboard: true, // Разрешить изменение размера клавиатуры
                }
        })
    }

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const messageText = msg.text;
    
        // Обработка нажатий на кнопки
        switch (messageText) {
            case 'Сделать Заказ!':
                mas.forEach((obj) => {
                    const message = `Image: ${obj.image}\nName: ${obj.title}\nPrice: ${obj.price}\nColor: ${obj.color}`;

    // Создание кнопки для каждого сообщения
                const keyboard = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Добавить корзинку', // Текст кнопки
                                    callback_data: `add_Title: ${obj.title}, Price: ${obj.price}, Color: ${obj.color}`// Данные, которые будут переданы при нажатии на кнопку
                                }
                            ]
                        ]
                    }
                };

        // Отправка сообщения с кнопкой
        bot.sendMessage(chatId, message, keyboard)
                .then(() => {
                    console.log('Сообщение отправлено');
                })
                .catch((error) => {
                    console.error('Ошибка:', error);
                });
                });
                break;
            case 'Регистрация':
                bot.sendMessage(chatId, 'as');
                break;
            case 'Корзинка': 
                bot.sendMessage(chatId, 'Korzinka\d' + korzinka)
            default:
                break;
        }
    });

});

bot.on('callback_query', (query) => {
    const data = query.data;
    if(data.startsWith('add_')){
        korzinka.push(data);
        bot.answerCallbackQuery(query.id, 'Продукт добавлен в массив');
        console.log(korzinka)
    }        
});




const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))
