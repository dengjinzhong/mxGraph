module.exports = {
  // 此项是用来告诉eslint找当前配置文件不能往父级查找
  root: true,
  parserOptions: {
    parser: 'babel-eslint', // 此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
    sourceType: 'module' // 此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
  },
  // 此项指定环境的全局变量，下面的配置指定为浏览器环境
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  // 此项是用来配置标准的js风格
  extends: ['plugin:vue/recommended', 'eslint:recommended'],
  // 下面这些rules是用来设置从插件来的规范代码的规则，使用必须去掉前缀eslint-plugin-
  // 主要有如下的设置规则，可以设置字符串也可以设置数字，两者效果一致
  // "off" -> 0 关闭规则
  // "warn" -> 1 开启警告规则
  // "error" -> 2 开启错误规则
  rules: {
    // 每行最大属性
    'vue/max-attributes-per-line': [2, {
      'singleline': 10,
      'multiline': {
        'max': 1,
        'allowFirstLine': false
      }
    }],
    'vue/require-default-prop': 'off',
    // 单行html元素内容在新的一行
    'vue/singleline-html-element-content-newline': 'off',
    // 多行html元素内容在新的一行
    'vue/multiline-html-element-content-newline': 'off',
    // 组件名称强制驼峰写法
    'vue/name-property-casing': ['error', 'PascalCase'],
    // 不使用v-html
    'vue/no-v-html': 'off',
    // 应同时设置setter和getter
    'accessor-pairs': 2,
    // 箭头间距
    'arrow-spacing': [2, {
      'before': true,
      'after': true
    }],
    // 块间距
    'block-spacing': [2, 'always'],
    // 大括号样式允许单行
    'brace-style': [2, '1tbs', {
      'allowSingleLine': true
    }],
    // 为属性强制执行驼峰命名
    'camelcase': [1, {
      "properties": "never"
    }],
    // 逗号间距
    'comma-spacing': [2, {
      'before': false,
      'after': true
    }],
    // (默认）与数组元素，对象属性或变量声明在同一行之后和同一行需要逗号
    'comma-style': [2, 'last'],
    'constructor-super': 2,
    // 当一个块只包含一条语句时，不允许省略花括号
    'curly': [2, 'multi-line'],
    // 成员表达式中的点应与属性部分位于同一行
    'dot-location': [2, 'property'],
    // 强制文件以换行符结束（LF）
    'eol-last': 2,
    // 强制使用全等
    'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
    // 生成器中'*'两侧都要有间距
    'generator-star-spacing': [2, {
      'before': true,
      'after': true
    }],
    'handle-callback-err': [2, '^(err|error)$'],
    // 缩进风格
    'indent': [2, 2, {
      'SwitchCase': 1
    }],
    'jsx-quotes': [2, 'prefer-single'],
    // 强制在对象字面量属性中的键和值之间保持一致的间距
    'key-spacing': [2, {
      'beforeColon': false,
      'afterColon': true
    }],
    // 关键字如if/function等的间距
    'keyword-spacing': [2, {
      'before': true,
      'after': true
    }],
    // 允许在没有new操作符的情况下调用大写启动的函数;（默认）要求new使用大写启动函数调用所有操作符
    'new-cap': [0, {
      'newIsCap': true,
      'capIsNew': false
    }],
    // JavaScript通过new关键字调用函数时允许省略括号
    'new-parens': 2,
    // 允许使用Array构造函数。除非要指定生成数组的长度
    'no-array-constructor': 2,
    'no-caller': 2,
    // 允许使用console
    'no-console': 'off',
    // 不允许修改类声明的变量
    'no-class-assign': 2,
    'no-cond-assign': 2,
    // 不能修改使用const关键字声明的变量
    'no-const-assign': 2,
    // 不允许正则表达式中的控制字符
    'no-control-regex': 0,
    // 不允许在变量上使用delete操作符
    'no-delete-var': 2,
    // 不允许在函数声明或表达式中使用重复的参数名称
    'no-dupe-args': 2,
    // 不允许在类成员中使用重复的参数名称
    'no-dupe-class-members': 2,
    // 不允许在对象文字中使用重复键
    'no-dupe-keys': 2,
    // 不允许在switch语句的case子句中使用重复的测试表达式
    'no-duplicate-case': 2,
    // 不允许在正则表达式中使用空字符类
    'no-empty-character-class': 2,
    // 不允许空块语句
    'no-empty-pattern': 2,
    // 不允许使用eval
    'no-eval': 2,
    // 不允许在catch子句中重新分配例外
    'no-ex-assign': 2,
    // 不允许直接修改内建对象的原型
    'no-extend-native': 2,
    'no-extra-bind': 2,
    // 禁止不必要的布尔转换
    'no-extra-boolean-cast': 2,
    // 仅在函数表达式附近禁止不必要的括号
    'no-extra-parens': [2, 'functions'],
    // 消除一个案件无意中掉到另一个案件
    'no-fallthrough': 2,
    // 消除浮点小数点，并在数值有小数点但在其之前或之后缺少数字时发出警告
    'no-floating-decimal': 2,
    // 允许重新分配function声明
    'no-func-assign': 2,
    // 消除隐含eval()
    'no-implied-eval': 2,
    // 不允许function嵌套块中的声明
    'no-inner-declarations': [2, 'functions'],
    // 不允许RegExp构造函数中的无效正则表达式字符串
    'no-invalid-regexp': 2,
    // 捕获无效的空格
    'no-irregular-whitespace': 2,
    // 消除阴影变量声明
    'no-iterator': 2,
    // 禁止创建与范围内的变量共享名称的标签
    'no-label-var': 2,
    // 消除 JavaScript 中使用带标签的语句
    'no-labels': [2, {
      'allowLoop': false,
      'allowSwitch': false
    }],
    // 消除脚本顶层或其他块中不必要的和可能混淆的块
    'no-lone-blocks': 2,
    // 不允许使用混合空格和制表符进行缩进
    'no-mixed-spaces-and-tabs': 2,
    'no-multi-spaces': 2, // 禁止在逻辑表达式，条件表达式，声明，数组元素，对象属性，序列和函数参数周围使用多个空格
    'no-multi-str': 2, //  防止使用多行字符串
    // 最多一个空行
    'no-multiple-empty-lines': [2, {
      'max': 1
    }],
    'no-native-reassign': 2, // 不允许修改只读全局变量
    'no-negated-in-lhs': 2,
    'no-new-object': 2, // 不允许使用Object构造函数
    'no-new-require': 2, // 消除new require表达的使用
    'no-new-symbol': 2, // 防止Symbol与new 同时使用的意外错误
    'no-new-wrappers': 2, // 杜绝使用String，Number以及Boolean与new操作
    'no-obj-calls': 2, // 不允许调用Math，JSON和Reflect对象作为功能
    'no-octal': 2, // 不允许使用八进制文字
    'no-octal-escape': 2, // 不允许字符串文字中的八进制转义序列
    'no-path-concat': 2, // 防止 Node.js 中的目录路径字符串连接无效
    'no-proto': 2,
    'no-redeclare': 2, // 消除在同一范围内具有多个声明的变量
    'no-regex-spaces': 2, // 在正则表达式文字中不允许有多个空格
    'no-return-assign': [2, 'except-parens'], // 消除return陈述中的任务，除非用括号括起来
    'no-self-assign': 2, // 消除自我分配
    'no-self-compare': 2, // 禁止比较变量与自身
    'no-sequences': 2, // 禁止使用逗号运算符
    'no-shadow-restricted-names': 2,
    'no-spaced-func': 2,
    'no-sparse-arrays': 2, // 不允许稀疏数组文字
    'no-this-before-super': 2, // 在呼call前标记this/super关键字super()
    'no-throw-literal': 2, // 不允许抛出不可能是Error对象的文字和其他表达式
    'no-trailing-spaces': 2, //  不允许在行尾添加尾随空白
    'no-undef': 2, // 任何对未声明的变量的引用都会导致错误
    'no-undef-init': 2, // 消除初始化为undefined的变量声明
    'no-unexpected-multiline': 2, // 不允许混淆多行表达式
    'no-unmodified-loop-condition': 2, // 查找循环条件内的引用，然后检查这些引用的变量是否在循环中被修改
    'no-unneeded-ternary': [2, {
      'defaultAssignment': false // 不允许将条件表达式作为默认的分配模式
    }],
    'no-unreachable': 2, // 不允许可达代码return，throw，continue，和break语句后面还有语句
    'no-unsafe-finally': 2, // 不允许return，throw，break，和continue里面的语句finally块
    // 消除未使用的变量，函数和函数的参数
    // vars: 'all' 检查所有变量的使用情况，包括全局范围内的变量。这是默认设置。 args: 'after-used' 只有最后一个参数必须使用。例如，这允许您为函数使用两个命名参数，并且只要您使用第二个参数，ESLint 就不会警告您第一个参数。这是默认设置。
    'no-unused-vars': [0, {
      'vars': 'all',
      'args': 'none'
    }],
    'no-useless-call': 2, // 标记使用情况，Function.prototype.call()并且Function.prototype.apply()可以用正常的函数调用来替代
    'no-useless-computed-key': 2, // 禁止不必要地使用计算属性键
    'no-useless-constructor': 2, // 在不改变类的工作方式的情况下安全地移除的类构造函数
    'no-useless-escape': 0, // 禁用不必要的转义字符
    'no-whitespace-before-property': 2, // 如果对象的属性位于同一行上，不允许围绕点或在开头括号之前留出空白
    'no-with': 2, // 禁用with
    // 强制将变量声明为每个函数（对于var）或块（对于let和const）范围一起声明或单独声明。 initialized: 'never' 每个作用域要求多个变量声明用于初始化变量
    'one-var': [2, {
      'initialized': 'never'
    }],
    // 实施一致的换行
    'operator-linebreak': [2, 'after', {
      'overrides': {
        '?': 'before',
        ':': 'before'
      }
    }],
    // 在块内强制执行一致的空行填充
    'padded-blocks': [2, 'never'],
    // avoidEscape: true 允许字符串使用单引号或双引号，只要字符串包含必须以其他方式转义的引号 ;allowTemplateLiterals: true 允许字符串使用反引号
    'quotes': [2, 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }],
    // 不使用分号
    'semi': [2, 'never'],
    // 强制分号间隔
    'semi-spacing': [2, {
      'before': false,
      'after': true
    }],
    'space-before-blocks': [2, 'always'], // 块必须至少有一个先前的空间
    'space-before-function-paren': [2, 'never'], // 在(参数后面不允许任何空格
    'space-in-parens': [2, 'never'], // 禁止或要求（或）左边的一个或多个空格
    'space-infix-ops': 2, // 强制二元运算符左右各有一个空格
    //  words: true 如：new，delete，typeof，void，yield 左右必须有空格 // nonwords: false 一元运算符，如：-，+，--，++，!，!!左右不能有空格
    'space-unary-ops': [2, {
      'words': true,
      'nonwords': false
    }],
    // 注释开始后，此规则将强制间距的一致性//或/*
    'spaced-comment': [2, 'always', {
      'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
    }],
    'template-curly-spacing': [2, 'never'], // 不允许大括号内的空格
    'use-isnan': 2, // 禁止比较时使用NaN，只能用isNaN()
    'valid-typeof': 2, // 必须使用合法的typeof的值
    'wrap-iife': [2, 'any'], // 立即执行函数表达式的小括号风格
    'yield-star-spacing': [2, 'both'], // 强制执行*周围 yield*表达式的间距，两侧都必须有空格
    'yoda': [2, 'never'],
    'prefer-const': 2, // 使用let关键字声明的变量，但在初始分配后从未重新分配变量，应改为const声明
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0, // 正式环境不允许debugger
    'object-curly-spacing': [2, 'always', {
      objectsInObjects: false // 不允许以对象元素开始和/或以对象元素结尾的对象的大括号内的间距
    }],
    'array-bracket-spacing': [2, 'never'] // 不允许数组括号内的空格
  }
}
