import { TestBed } from '@angular/core/testing';

import { InterceptorLojaInterceptor } from './interceptor-loja.interceptor';

describe('InterceptorLojaInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      InterceptorLojaInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: InterceptorLojaInterceptor = TestBed.inject(InterceptorLojaInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
