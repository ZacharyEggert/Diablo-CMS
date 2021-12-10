import 'module-alias/register';
import { addAliases } from 'module-alias';

addAliases({
    '@lib': __dirname + '/lib',
    '@controllers': __dirname + '/controllers',
    '@entities': __dirname + '/entities',
    '@routes': __dirname + '/routes',
});
