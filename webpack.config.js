'use strict';

/*** Переменная окружения. Показывает в какой стадии находится проект(development, production).*/
const NODE_ENV = process.env.NODE_ENV || 'development'; //создаем, для возможности переключения функционала
/** Плагин может подключаться на разных стадиях компиляции(интерпретации) и что-то делать*/
const webpack = require('webpack'); //подключаем для использования его плагино

module.exports = {

  /** Тут можно записать путь, который будет доставлен ко всем точкам входа(к entry)*/
  context: __dirname + '/app',

  /** Точки входа. Какой js файл исходный будем собирать*/
  entry: {
    home: "./home",
    about: './about'
  },

  output: {  //модуль, куда будем выводить
    path: __dirname + "/dist",
    filename: "[name].js",  //[name] - шаблон, в который будут поставляться имена из entry. В этом файле будут содержаться весь код приложения, который нашел webpack
    library: "[name]"  //добавляем переменную, теперь она будет доступна в home.html и через нее можем вызывать все, чтобы было export-нуто
  },

  /** Cледит, если файлы изменились - сборка будет перезапущена*/
  watch: NODE_ENV == 'development',

  watchOptions: {
    aggregateTimeout: 100 //ожидание webpack, пока редактор сохранит файлы перед пересборкой
  },

  devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null, //дает возможность отлаживать файлы, а не bundle.js при использовании debugger

  plugins: [
    // new webpack.NoErrorsPlugin(), //проверяет, если была ошибка сборки, то не собирать
    new webpack.NodeEnvironmentPlugin('NODE_ENV', 'USER'), //Теперь webpack следует запускать с типом разработки: NODE_ENV=development webpack
    /** Плагин, собирает, что есть общее в точках входа и выносит их в один файл. Т.е. нету повторений кода*/
    new webpack.optimize.CommonsChunkPlugin({
      name: "common"
    })
  ],

  // /** Описывает, как и где webpack будет искать модули*/
  // resolve: {
  //   modulesDirectories: ['node_modules'],
  //   extensions: ['', '.js']  //с какими расширениями следует искать модули
  // },
  //
  // /** Описывает, как и где webpack будет искать лоэдеры, если не указан путь*/
  // resolveLoader: {
  //   modulesDirectories: ['node_modules'],
  //   moduleTemplates: ['*-loader'],
  //   extensions: ['', '.js']  //с какими расширениями следует искать модули
  // },

  /** Модули содержат в себе различные лоудеры, если не указан путь. Которые будут преобразовывать современный код в старый, для поддержки всеми браузерами*/
  module: {
    /**Существуют также preloaders, postloaders*/
    loaders: [{
      test: /\.js$/, //файлы, которые лоэдер будет искать
      //
      // include: {  //тоже, что и тест, только по соглашению test - для проверки расширений, include - для путей
      //
      // },
      // exclude: {  //те файлы, к которым лоэдер не будет применяться
      //
      // },
      loader: 'babel-loader'  //сам лоэдер, optional
    }]
  },

  /** Конфиг для webpack-dev-server. Сохраняет все файлы в памяти. Но если надо, то можно в адресе просто дописать
   * имя нужного файла и получить его. П: localhost:8080/main.js*/
  devServer: {
    host: 'localhost',
    port: 8080,
    contentBase: __dirname + '/app'
  }
}


/** !!! Минификация - разобраться, 9 урок*/
// if( NODE_ENV == 'production') {
//   module.exports.plugins.push(
//     new webpack.optimize.UglifyJsPlugin({
//
//     })
//   )
// }


/**
 * stage0 - означает всякие экспериментальные возможности. Если для babel параметром передать stage0 - он будет обрабатывать всякие экспериментальные вещи
 * __dirname - абсолютный путь к папку, в которой лежит текущий файл(webpack.config.js)
 * */