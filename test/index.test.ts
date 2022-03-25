const { handleSource } = require('../dist/universal-handler')

test('value infer', () => {

    const template = '<view class="w-[0.5px] w-0.5px w-[2rpx] w-2rpx"></view>'
    const handledTemplate = handleSource('template', template)

    expect(handledTemplate).toBe('<view class="w--0-d-5px- w-0-d-5px w--2rpx- w-2rpx"></view>')

})

test('rgb value infer', () => {

    const template = '<view class="text-rgba(25,25,25,0) bg-[rgba(25,25,25,0)]"></view>'
    const handledTemplate = handleSource('template', template)

    expect(handledTemplate).toBe('<view class="text-rgba-25-2c-25-2c-25-2c-0- bg--rgba-25-2c-25-2c-25-2c-0--"></view>')

})

test('important', () => {

    const template = '<view class="!w-20"></view>'
    const handledTemplate = handleSource('template', template)

    expect(handledTemplate).toBe('<view class="-i-w-20"></view>')

})

test('fraction', () => {

    const template = '<view class="translate-x-1/2 translate-x-[0.5px]"></view>'
    const handledTemplate = handleSource('template', template)

    expect(handledTemplate).toBe('<view class="translate-x-1-s-2 translate-x--0-d-5px-"></view>')

})

test('hex value', () => {

    const template = '<view class="bg-#000000 bg-[#000000]"></view>'
    const handledTemplate = handleSource('template', template)

    expect(handledTemplate).toBe('<view class="bg--h-000000 bg---h-000000-"></view>')

})

test('variant', () => {

    const template = '<view class="hover:bg-black"></view>'
    const handledTemplate = handleSource('template', template)

    expect(handledTemplate).toBe('<view class="hover-c-bg-black"></view>')

})

test('css value infer with rpx', () => {

    // eslint-disable-next-line no-useless-escape
    const style = '.h-\\[0\\.5px\\] {height: 0.5px;}'
    const handledTemplate = handleSource('style', style, { enableRpx: true })

    expect(handledTemplate).toBe('.h--0-d-5px- {height: 1rpx;}')

})

test('css value infer', () => {

    // eslint-disable-next-line no-useless-escape
    const style = '.h-\\[0\\.5px\\] {height: 0.5px;}'
    const handledTemplate = handleSource('style', style, { enableRpx: false })

    expect(handledTemplate).toBe('.h--0-d-5px- {height: 0.5px;}')

})
