import * as flsFunctions from './modules/functions.js';
flsFunctions.isWebp();

import AirDatepicker from 'air-datepicker';
import choices from 'choices.js';

const form = document.querySelector('.calendar__form');
const selectElement1 = document.querySelector('.calendar__select1');
const selectElement2 = document.querySelector('.calendar__select2');
const calendarBtn = document.querySelector('.calendar__btn');
const selectElements = [selectElement1, selectElement2];
const currentDate = new Date();
const day = currentDate.getDate();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const year = currentDate.getFullYear();

const errorMessage = document.createElement('span');
errorMessage.classList.add('error-message');
form.insertAdjacentElement('afterend', errorMessage);

let button = {
    content: 'Сьогодні',
    onClick: (dp) => {
        let date = currentDate;
        dp.selectDate(date);
        dp.setViewDate(date);
    },
};

function compareTime(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    if (hours1 !== hours2) {
        return hours1 > hours2 ? -1 : 1;
    }

    if (minutes1 !== minutes2) {
        return minutes1 > minutes2 ? -1 : 1;
    }

    return 0;
}

selectElements.forEach(function (selectElement) {
    selectElement.addEventListener('change', function () {
        let date1 = airdatepicker1.value;
        let date2 = airdatepicker2.value;
        let time1 = selectElement1.textContent;
        let time2 = selectElement2.textContent;

        updateErrorMessage(date1, date2, time1, time2);
    });
});

// Функция для автодобавления опций

function addTimeOptions() {
    let date1 = airdatepicker1.value;
    const currentTime = new Date();
    let startTime;
    const today = `${day}.${month}.${year}`;

    if (date1 === today) {
        startTime = new Date(
            Math.ceil(currentTime.getTime() / (30 * 60 * 1000)) *
                (30 * 60 * 1000)
        );
    }
    if (date1 !== today) {
        startTime = new Date();
        startTime.setHours(9, 0, 0, 0); // Установка начального времени, в данном случае 9:00
    }
    const endTime = new Date(currentTime); // Конечное время
    endTime.setHours(23, 59, 0); // Установка конечного времени, в данном случае 18:00

    const timeOptions = [];

    // Цикл для добавления опций с интервалом в полчаса
    while (startTime <= endTime) {
        const optionText = startTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
        const optionValue = startTime.toISOString();

        timeOptions.push({ label: optionText, value: optionValue });

        startTime.setTime(startTime.getTime() + 30 * 60 * 1000); // Добавление 30 минут
    }
    return timeOptions;
}

function updateErrorMessage(date1, date2, time1, time2) {
    if (date1 > date2 && date1 !== '' && date2 !== '') {
        errorMessage.textContent = 'lfksdjkfd';
    } else if (date1 === date2 && date1 !== '' && date2 !== '') {
        if (compareTime(time1, time2) < 1) {
            errorMessage.textContent =
                'Время конца аренды не может быть раньше или в то же время что и начало';
        } else {
            errorMessage.textContent = '';
        }
    } else {
        errorMessage.textContent = '';
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // updateSelectElements();

    new AirDatepicker('#airdatepicker1', {
        minDate: currentDate,
        container: 'calendar',
        disableNavWhenOutOfRange: true,
        buttons: [button, 'clear'],
        autoClose: true,
        onSelect({ date, formattedDate, datepicker }) {
            let date1 = airdatepicker1.value;
            let date2 = airdatepicker2.value;
            let time1 = selectElement1.textContent;
            let time2 = selectElement2.textContent;

            updateErrorMessage(date1, date2, time1, time2);
            // Очистка выбранных опций в select1
            if (selectElement1.choices) {
                selectElement1.choices.destroy();
            }
            if (selectElement2.choices) {
                selectElement2.choices.destroy();
            }

            // Инициализация выборов для selectElement1
            selectElement1.choices = new choices(selectElement1, {
                searchEnabled: false,
                shouldSort: false,
                choices: addTimeOptions(),
                allowHTML: true,
            });

            // Инициализация выборов для selectElement2
            selectElement2.choices = new choices(selectElement2, {
                searchEnabled: false,
                shouldSort: false,
                choices: addTimeOptions(),
                allowHTML: true,
            });
        },
        locale: {
            days: [
                'Неділя',
                'Понеділок',
                'Вівторок',
                'Середа',
                'Четвер',
                'П’ятниця',
                'Субота',
            ],
            daysShort: ['Нед', 'Пнд', 'Вів', 'Срд', 'Чтв', 'Птн', 'Сбт'],
            daysMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            months: [
                'Січень',
                'Лютий',
                'Березень',
                'Квітень',
                'Травень',
                'Червень',
                'Липень',
                'Серпень',
                'Вересень',
                'Жовтень',
                'Листопад',
                'Грудень',
            ],
            monthsShort: [
                'Січ',
                'Лют',
                'Бер',
                'Кві',
                'Тра',
                'Чер',
                'Лип',
                'Сер',
                'Вер',
                'Жов',
                'Лис',
                'Гру',
            ],
            today: 'Сьогодні',
            clear: 'Очистити',
            dateFormat: 'dd.MM.yyyy',
            timeFormat: 'HH:mm',
            firstDay: 1,
        },
    });

    new AirDatepicker('#airdatepicker2', {
        minDate: currentDate,
        disableNavWhenOutOfRange: true,
        buttons: [button, 'clear'],
        autoClose: true,
        onSelect({ date, formattedDate, datepicker }) {
            let date1 = airdatepicker1.value;
            let date2 = airdatepicker2.value;
            let time1 = selectElement1.textContent;
            let time2 = selectElement2.textContent;

            updateErrorMessage(date1, date2, time1, time2);
        },
        locale: {
            days: [
                'Неділя',
                'Понеділок',
                'Вівторок',
                'Середа',
                'Четвер',
                'П’ятниця',
                'Субота',
            ],
            daysShort: ['Нед', 'Пнд', 'Вів', 'Срд', 'Чтв', 'Птн', 'Сбт'],
            daysMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            months: [
                'Січень',
                'Лютий',
                'Березень',
                'Квітень',
                'Травень',
                'Червень',
                'Липень',
                'Серпень',
                'Вересень',
                'Жовтень',
                'Листопад',
                'Грудень',
            ],
            monthsShort: [
                'Січ',
                'Лют',
                'Бер',
                'Кві',
                'Тра',
                'Чер',
                'Лип',
                'Сер',
                'Вер',
                'Жов',
                'Лис',
                'Гру',
            ],
            today: 'Сьогодні',
            clear: 'Очистити',
            dateFormat: 'dd.MM.yyyy',
            timeFormat: 'HH:mm',
            firstDay: 1,
        },
    });
});

if (errorMessage.textContent !== '') {
    calendarBtn.disabled = true;
} else {
    calendarBtn.disabled = false;
}
