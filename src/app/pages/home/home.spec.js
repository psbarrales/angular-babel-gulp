describe('Home Module', () => {
    let $Controller;

    beforeEach(module('app'));

    beforeEach(inject(_$controller_ => {
        $Controller = _$controller_('HomeController');
    }));

    it('should HomeController to be defined', () => {
        expect($Controller).toBeDefined();
    });
})