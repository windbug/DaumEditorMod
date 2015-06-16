/**
 * @fileoverview 
 * 외부 이모티콘
 *     
 */
(function() {
	TrexConfig.addTool(
		"emoticon",
		{
			sync: _FALSE,
			status: _FALSE
		}
	);

	Trex.Tool.Emoticon = Trex.Class.create({
		$const: {
			__Identity: 'emoticon'
		},
		$extend: Trex.Tool,
        oninitialized: function() {
            /* button & menu weave */
            this.weave(
                new Trex.Button(this.buttonCfg),
                _NULL,
                this.handler
            );
        },
        handler: function() {
			Trex.Tool.Embed('icon',1,400,200,'아이콘 삽입하기');
		}
	});
})();