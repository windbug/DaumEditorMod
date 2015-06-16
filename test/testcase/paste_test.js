($tx.msie && $tx.msie_ver <= 8) &&
(function() {
    module("paste html");

    test('regression : IE paste causes invalid markup', function() {
        var assi = new Assistant();
        assi.setContent('<p><span>text</span></p>');
        var span = assi.byTag('span');
        var textNode = span.childNodes[0];
        assi.selectForNodes(textNode, 4, textNode, 4);

        var range = assi.createGoogRange();

        range.getBrowserRangeObject().pasteHTML('<span>inserted</span><p>text</p>');

        htmlEqual(assi.getContent(), '<p><span>text</span><span>inserted</span></p><p>text</p>');
    });

    test('move caret after end element', function() {
        var assi = new Assistant();
        assi.setContent('<p><span>text</span> </p>');
        var p = assi.byTag('p');
        assi.selectForNodes(p, 2, p, 2);

        var range = assi.createGoogRange();
        range.getBrowserRangeObject().pasteHTML('<span>inserted</span><p>text</p>');

        htmlEqual(assi.getContent(), '<p><span>text</span> <span>inserted</span></p><p>text</p>');
    });

})();

var autolinkConverter;
module('paste autolink', {
    "setup": function() {
        autolinkConverter = new Trex.Paste.AutolinkConverter();
    },
    "teardown": function() {
        autolinkConverter = null;
    }
});

test('���ڿ� url ���ϸ�Ī ����üũ', function() {
    equal(autolinkConverter.isContainSpace('http://www.daum.net����'), false);
    equal(autolinkConverter.isContainSpace('http://www.daum.net���� �̵��ϸ� �ȴ�.'), true);
});

test('���ڿ� url���� üũ', function() {
    [
        // false
        ['192.168.0', false, '���ڷθ� ������ host���´� url�� �Ǵ����� �ʴ´�'],
        ['192.168.0/path', false, '���ڷθ� ������ host���´� url�� �Ǵ����� �ʴ´�'],
        ['192.168.0/path?query=test', false, '���ڷθ� ������ host���´� url�� �Ǵ����� �ʴ´�'],
        ['192.168.0.333', false, 'ip���� üũ'],
        ['1.1.0.20', false, 'ip���� üũ'],
        ['daum.net', false, '1�� �����θ� �ִ°��� url�� �ν����� ����'],
        ['http://www.daum.net����', false, 'url�� �ǹ̿� �����ʰ� �ٿ��� �ѱ��� url�� �Ǵ����� �ʴ´�'],
        ['http://www.daum.net ����', false, '���ڿ� �߰��� ������ ���� �ȵȴ�'],

        // true
        ['192.168.0.100', true, 'ip������ �����ٸ� ���� �����̶� ��ũ�� �ν��Ѵ�. ��, IP�� ������ üũ��'],
        ['10.10.192.220', true, 'ip���� üũ'],
        ['10.10.192.220/path', true, 'ip���� üũ'],
        ['10.10.192.220/path?query=test', true, 'ip���� üũ'],
        ['10.10.192.220/path?query=test#hash/hashPath-dash', true, 'ip���� üũ'],
        ['10.10.192.220:8080/path?query=test#hash/hashPath-dash', true, 'ip���� üũ'],
        ['www.daum.net', true, '���������� ��� �������� �Ǵ��Ѵ�'],
        ['www.daum.net/path', true, '���������� ���� path'],
        ['http://www.daum.net/����', true, '�ǹ̾��� �ѱ��� ������ path�� �����ϴ� ������ �ν��Ѵ�'],
        ['http://www.daum.net/path����', true, '�ǹ̾��� �ѱ��� ������ path�� �����ϴ� ������ �ν��Ѵ�'],
        ['http://www.daum.net/path?query=a����', true, '�ǹ̾��� �ѱ��� ������ query�� �����ϴ� ������ �ν��Ѵ�'],
        ['http://www.daum.net ', true, '���ڿ� �� ����üũ'],
        [' http://www.daum.net', true, '���ڿ� �� ����üũ'],
        ['http://www.daum.net', true, '�����θ� ����'],
        ['http://www.daum.net/', true, '������ + /'],
        ['http://www.daum.net:8080', true, '��Ʈ�߰�'],
        ['http://www.daum.net:8080/', true, '��Ʈ�߰� + /'],
        ['http://daum.net', true, '�����ο� www ����'],
        ['http://daum.net:8080', true, '�����ο� www ���� + ��Ʈ�߰�'],
        ['http://daum.net/', true, '�����ο� www ���� + /'],
        ['http://daum.net:8080/', true, '�����ο� www ���� + ��Ʈ�߰� + /'],
        ['http://daum.net:8080/path', true, '��Ʈ �߰� + path'],
        ['http://daum.net/#', true, 'hash�±� #1'],
        ['http://daum.net/#head-link2', true, 'hash�±� #2'],
        ['http://daum.net/#�ѱ�', true, 'hash�±� �ѱ�'],
        ['http://daum.net/#%ED%95%9C%EA%B8%80', true, 'hash�±� ���ڵ� �ѱ�'],
        ['http://editor.daum.net/test?query=�ѱ�', true, '�ѱ� query'],
        ['http://editor.daum.net/test?query=%ED%95%9C%EA%B8%80', true, '���ڵ��� �ѱ� query'],
        ['https://daum.net/', true, 'https Ȯ��'],
        ['https://daum.net/gogo', true, 'path ��� Ȯ��'],
        ['https://maart-1.net', true, '- ���� ������'],
        ['https://maart-1.daum.net/gogo', true, '- ���� ������ + path'],
        ['http://bbs.music.daum.net', true, '3�� ������'],
        ['http://bbs.music.daum.net/gaia/do/list', true, '3�� ������ + path'],
        ['http://bbs.music.daum.net/gaia/do/list?bbsId=test&dummy=%EB%8B%A4%EC%9D%8C%EC%97%90%EB%94%94%ED%84%B0', true, '3�� ������ + path + query']

    ].each(function(item){
        var desc = item[2] ? item[2] + ' : ' + item[0] : item[0];
        equal(autolinkConverter.isValidUrl(item[0]), item[1], desc);
    });
});

test('HTML anchor ���� üũ', function(){
    [
        ['<a href="#">��ũ</a>', true, '����ũ'],
        ['<a href="#" style="display:none;">��ũ</a>', true, '�Ӽ� ���� ��'],
        ['<a style="display:none;" class="test-link" href="#" >��ũ</a>', true, '�Ӽ� ���� �ڹٲ�'],
        ['<A style="display:none;" class="test-link" href="#" >��ũ</A>', true, '�빮�� �±�'],
        ['<A style="display:none;" class="test-link" href="#" >��ũ</A> ', true, '�±� �� ����'],
        [' <A style="display:none;" class="test-link" href="#" >��ũ</A>', true, '�±� �� ����']

    ].each(function(item){
        var desc = item[2] ? item[2] + ' : ' + item[0] : item[0];
        equal(autolinkConverter.isAnchorTag(item[0]), item[1], desc);
    });
});

test('HTML anchor ���� �Ľ� üũ', function(){
    [
        ['<a href="#">��ũ</a>', '��ũ', '����ũ'],
        ['<a href="http://www.daum.net">www.daum.net</a>', 'www.daum.net', 'href �Ӽ��� �ƴ� text ������� �Ľ�'],
        ['<a href="#">��ũ</a>', '��ũ', '����ũ']

    ].each(function(item){
        var desc = item[2] ? item[2] + ' : ' + item[0] : item[0];
        equal(autolinkConverter.parseAnchor(item[0]), item[1], desc);
    });
});


var paster,
    pasteProcessor;

function getTextContent(node) {
    return node.textContent || node.innerText;
}
module('paste basic', {
    'setup': function() {
        paster = Editor.getPaster();
        pasteProcessor = Editor.getPasteProcessor();
        assi.setContent('');

    },
    'teardown': function() {
        paster = null;
        pasteProcessor = null;
    }
});

test('tree ������', function(){
    assi.setContent('<p><span>12<strong>34</strong>56</span></p>');

    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    var result = pasteProcessor.divideTree(assi.$$("p")[0]);
    assi.delayedAssertion(function() {
        pasteProcessor.removeDummyText();

        ok(result.previousNode, '���� ��尴ü�� �����ؾ� �Ѵ�');
        equal(result.previousNode.nodeType, 1, '���� ��尴ü�� �����ؾ� �Ѵ�');
        equal(result.previousNode.tagName, 'P', 'p�±� �����̳�');
        equal(getTextContent(result.previousNode), '123', '���� ��尴ü�� �����ؾ� �Ѵ�');
        equal(assi.$$('strong', result.previousNode)[0].innerHTML, '3', '��� ������ �����ؾ� �Ѵ�');
        equal(assi.$$('strong', result.previousNode)[0].parentNode.tagName, 'SPAN', '��� ������ �����ؾ� �Ѵ�');
        equal(assi.$$('strong', result.previousNode)[0].parentNode.parentNode.tagName, 'P', '��� ������ �����ؾ� �Ѵ�');

        ok(result.nextNode, '���� ��尴ü�� �����ؾ� �Ѵ�');
        equal(result.nextNode.nodeType, 1, '���� ��尴ü�� �����ؾ� �Ѵ�');
        equal(result.nextNode.tagName, 'P', 'p�±� �����̳�');
        equal(getTextContent(result.nextNode), '456', '���� ��尴ü�� �����ؾ� �Ѵ�');
        equal(assi.$$('strong', result.nextNode)[0].innerHTML, '4', '��� ������ �����ؾ� �Ѵ�');
        equal(assi.$$('strong', result.nextNode)[0].parentNode.tagName, 'SPAN', '��� ������ �����ؾ� �Ѵ�');
        equal(assi.$$('strong', result.nextNode)[0].parentNode.parentNode.tagName, 'P', '��� ������ �����ؾ� �Ѵ�');
    });
});

test('�ٿ��ֱ� �⺻ �׽�Ʈ', function(){
    assi.setContent('<p><span>12<strong>34</strong>56</span></p>');

    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    var range = Editor.canvas.getProcessor().createGoogRange();
    ok(range, '�и� �� range��ü�� Ȯ�� �����ؾ� �Ѵ�');
    var focusNode = range.getFocusNode();
    ok(focusNode, '�и� �� range.focusNode ��ü�� Ȯ�� �����ؾ� �Ѵ�');

    paster.pasteHTML('<p>test1</p>');
    paster.pasteHTML('<p>test2</p>');
    paster.pasteHTML('<p>test3</p>');

    assi.delayedAssertion(function() {
        equal(assi.$$('p').length, 5, '3���� p�±׸� �߰������Ƿ� �������� �±׿� �Բ� �� 5���� �����ؾ� ��.');
        equal(assi.$$('p')[1].innerHTML, 'test1', '2��° p�±��� ������ test1�̴�');
        equal(assi.$$('p')[2].innerHTML, 'test2', '3��° p�±��� ������ test2�̴�');
        equal(assi.$$('p')[3].innerHTML, 'test3', '4��° p�±��� ������ test3�̴�');
    });
});


test('�ٿ��ֱ� �� range�� �ٿ����� �������� ���� �������� ��ġ�ؾ� �Ѵ�', function(){
    assi.setContent('<p>111222</p>');

    var targetParagraphText = assi.$$("p")[0].childNodes[0];
    assi.selectForNodes(targetParagraphText, 3, targetParagraphText, 3);

    paster.pasteHTML('<p>aaa</p><p>bbb</p>');
    paster.pasteHTML('<p>ccc</p>');

    assi.delayedAssertion(function(){
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>111</p><p>aaa</p><p>bbb</p><p>ccc</p><p>222</p>', '��� html Ȯ��');

        var range = assi.createGoogRange();
        equal(range.isCollapsed(), true, 'range isCollapsed ����');
    });

});

test('p�±� �߰��� p�±� ������ �ٿ��ֱ�', function(){
    assi.setContent('<p>111</p><p>222</p><p>333</p>');

    var targetParagraphText = assi.$$("p")[1].childNodes[0];
    assi.selectForNodes(targetParagraphText, 1, targetParagraphText, 1);

    paster.pasteHTML('<p>aaa</p><p>bbb</p>');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>111</p><p>2</p><p>aaa</p><p>bbb</p><p>22</p><p>333</p>', '��� html Ȯ��');

        var range = assi.createGoogRange();
        equal(range.isCollapsed(), true, 'range isCollapsed ����');
    });
});

test('p�±� �߰��� text �ٿ��ֱ�', function(){
    assi.setContent('<p>111</p><p>222</p><p>333</p>');

    var targetParagraphText = assi.$$("p")[1].childNodes[0];
    assi.selectForNodes(targetParagraphText, 1, targetParagraphText, 1);

    paster.pasteHTML('aaa');

    assi.delayedAssertion(function() {

        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>111</p><p>2aaa22</p><p>333</p>', '��� html Ȯ��');

        var range = assi.createGoogRange();
        equal(range.isCollapsed(), true, 'range isCollapsed ����');
    });
});

test('body ���� text�� �߰��� �ؽ�Ʈ �ٿ��ֱ�', function(){
    assi.setContent('111<br>222<br>333<span>marker</span>');

    var marker = assi.$$("span")[0];
    var targetText = marker.previousSibling;
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('aaa');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '111<br>222<br>3aaa33<span>marker</span>', '��� html Ȯ��');

        var range = assi.createGoogRange();
        equal(range.isCollapsed(), true, 'range isCollapsed ����');
    });

});


test('body ���� text�� �߰��� p�±� �ٿ��ֱ�', function(){
    assi.setContent('111<br>222<br>333<span>marker</span>');

    var marker = assi.$$("span")[0];
    var targetText = marker.previousSibling;
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('<p>aaa</p>');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '111<br>222<br>3<p>aaa</p>33<span>marker</span>', '��� html Ȯ��');

        var range = assi.createGoogRange();
        equal(range.isCollapsed(), true, 'range isCollapsed ����');
    });

});

test('table ���ο� p�±׸� ������ - text', function() {
    assi.setContent('<p>abc</p><table><tbody><tr><td><p>1<strong>23</strong></p></td><td><p>456</p></td></tr></tbody></table><p>def</p>');
    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('!!');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>abc</p><table><tbody><tr><td><p>1<strong>2!!3</strong></p></td><td><p>456</p></td></tr></tbody></table><p>def</p>', '��� html Ȯ��');
    });
});

test('table ���ο� p�±׸� ������ - text&html', function() {
    assi.setContent('<p>abc</p><table><tbody><tr><td><p>1<strong>23</strong></p></td><td><p>456</p></td></tr></tbody></table><p>def</p>');
    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('<p>!!</p>');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>abc</p><table><tbody><tr><td><p>1<strong>2</strong></p><p>!!</p><p><strong>3</strong></p></td><td><p>456</p></td></tr></tbody></table><p>def</p>', '��� html Ȯ��');
    });
});

test('table ���ο� p�±׸� ������ - ���� text&html', function() {
    assi.setContent('<p>abc</p><table><tbody><tr><td><p>1<strong>23</strong></p></td><td><p>456</p></td></tr></tbody></table><p>def</p>');
    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('<p>!!</p>@@<p>##</p><div>$$</div>');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>abc</p><table><tbody><tr><td><p>1<strong>2</strong></p><p>!!</p><p>@@</p><p>##</p><div>$$</div><p><strong>3</strong></p></td><td><p>456</p></td></tr></tbody></table><p>def</p>', '��� html Ȯ��');
    });
});

test('table ���ο� p�±װ� ���� ���¸� ������', function() {
    assi.setContent('<p>abc</p><table><tbody><tr><td>1<strong>23</strong></td><td><p>456</p></td></tr></tbody></table><p>def</p>');
    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('<p>!!</p>');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>abc</p><table><tbody><tr><td>1<strong>2</strong><p>!!</p><strong>3</strong></td><td><p>456</p></td></tr></tbody></table><p>def</p>', '��� html Ȯ��');

        // TODO: ���������� �±��� ���� �����̳ʰ� P�±װ� �ƴ϶�� P�±׷� �����ֵ��� ����
//        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>abc</p><table><tbody><tr><td><p>1<strong>2</strong></p></p><p>!!</p><p><strong>3</strong></p></td><td><p>456</p></td></tr></tbody></table><p>def</p>', '��� html Ȯ��');
    });
});

test('li ���ο� p�±׸� ������', function() {
    assi.setContent('<p>abc</p><ul><li><p>1<strong>23</strong></p><p>456</p></li></ul><p>def</p>');
    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('<p>!!</p>');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>abc</p><ul><li><p>1<strong>2</strong></p><p>!!</p><p><strong>3</strong></p><p>456</p></li></ul><p>def</p>', '��� html Ȯ��');
    });
});

test('li ���ο� p�±װ� ���� ���¸� ������', function() {
    assi.setContent('<p>abc</p><ul><li>1<strong>23</strong><p>456</p></li></ul><p>def</p>');
    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('<p>!!</p>');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>abc</p><ul><li>1<strong>2</strong><p>!!</p><strong>3</strong><p>456</p></li></ul><p>def</p>', '��� html Ȯ��');
    });
});


test('li ���ο� p�±׸� ������ - ����', function() {
    assi.setContent('<p>abc</p><ul><li><p>1<strong>23</strong></p><p>456</p></li></ul><p>def</p>');
    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('<p>!!</p>@@<p>##</p>');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>abc</p><ul><li><p>1<strong>2</strong></p><p>!!</p><p>@@</p><p>##</p><p><strong>3</strong></p><p>456</p></li></ul><p>def</p>', '��� html Ȯ��');
    });
});

test('li ���ο� p�±װ� ���� ���¸� ������ - ���� #1', function() {
    assi.setContent('<p>abc</p><ul><li>1<strong>23</strong><p>456</p></li></ul><p>def</p>');
    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('<p>!!</p>@@<p>##</p>');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>abc</p><ul><li>1<strong>2</strong><p>!!</p><p>@@</p><p>##</p><strong>3</strong><p>456</p></li></ul><p>def</p>', '��� html Ȯ��');
    });
});


test('li ���ο� p�±װ� ���� ���¸� ������ - ���� #2 (pasteHTML�� 2����)', function() {
    assi.setContent('<p>abc</p><ul><li>1<strong>23</strong><p>456</p></li></ul><p>def</p>');
    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('<p>!!</p>');
    paster.pasteHTML('@@<p>##</p>');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>abc</p><ul><li>1<strong>2</strong><p>!!</p><p>@@</p><p>##</p><strong>3</strong><p>456</p></li></ul><p>def</p>', '��� html Ȯ��');
    });
});

test('p�±� ���� ��忡�� �ٿ��ֱ�', function() {


    assi.setContent('asd<strong>1234</strong>fghj');
    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('<p>!!</p>@@<p>##</p>');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), 'asd<strong>1</strong><p>!!</p><p>@@</p><p>##</p><strong>234</strong>fghj', '��� html Ȯ��');

    });
});


test('p�±� ���� ��忡�� �ٿ��ֱ�', function() {
    assi.setContent('asd<strong>1234</strong>fghj');
    var targetText = assi.$$("strong")[0].childNodes[0];
    assi.selectForNodes(targetText, 1, targetText, 1);

    paster.pasteHTML('<p>!!</p>@@<p>##</p>');

    assi.delayedAssertion(function() {
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), 'asd<strong>1</strong><p>!!</p><p>@@</p><p>##</p><strong>234</strong>fghj', '��� html Ȯ��');
    });
});

test('�ٿ��ֱ� ������ �� ������ ��Ұ� br�ΰ��', function() {
    assi.setContent('<p>content</p>');
    assi.focusOnTop();

    paster.pasteHTML('<p>test1</p><br>');
    paster.pasteHTML('<p>test2</p><br>');

    assi.delayedAssertion(function() {
        // TODO: body > br ������ ���� ó���� ���Ŀ� ���� �����ϱ�� �Ѵ�. ����� �ٿ��ִ� ���� �״�θ� �����ϵ��� ��.
        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>test1</p><br><p>test2</p><br><p>content</p>', '��� html Ȯ��');
    });
});

// invalid markup
//test('invalid markup #1', function() {
//    assi.setContent('<p>123</p><p>4<strong>56</strong></p><p>789</p>');
//    var targetText = assi.$$("strong")[0].childNodes[0];
//    assi.selectForNodes(targetText, 1, targetText, 1);
//
//    paster.pasteHTML('<span><p>!!</span></p>');
//
//    assi.delayedAssertion(function() {
//        equal(assi.getContent().toLowerCase().replace(/[\r\n]/g, ''), '<p>123</p><p>4<strong>5</strong></p><p>!!</p><p><strong>6</strong></p><p>789</p>', '��� html Ȯ��');
//    });
//});

// body
// li > table
// blockquote > table
// li > blockquote
// h1 > p
// p > h1
//