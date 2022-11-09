import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Item } from '../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../item-page-routing-paths';
import { RouteService } from '../../../../core/services/route.service';
import { Observable } from 'rxjs';
import { getDSpaceQuery, isIiifEnabled, isIiifSearchEnabled } from './item-iiif-utils';
import { AppState } from 'src/app/app.reducer'; //kware-edit
import { select, Store } from '@ngrx/store'; //kware-edit
import { isAuthenticated } from 'src/app/core/auth/selectors'; //kware-edit
import { hasValue } from 'src/app/shared/empty.util'; //kware-edit

@Component({
  selector: 'ds-item',
  template: ''
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class ItemComponent implements OnInit {
  @Input() object: Item;

  /**
   * Route to the item page
   */
  itemPageRoute: string;

  isAuthorized$: Observable<boolean>;  //kware-edit

  locale:any;  //kware-edit

  lang:boolean  //kware-edit

  /**
   * Enables the mirador component.
   */
  iiifEnabled: boolean;

  /**
   * Used to configure search in mirador.
   */
  iiifSearchEnabled: boolean;

  /**
   * The query term from the previous dspace search.
   */
  iiifQuery$: Observable<string>;

  mediaViewer;

  constructor(protected routeService: RouteService,
    public store: Store<AppState>, //kware-edit
    ) {
    this.mediaViewer = environment.mediaViewer;
  }

  ngOnInit(): void {
    if (typeof window === 'object' && hasValue(window.localStorage)) {
      this.locale = window.localStorage.getItem('selectedLangCode');
     }
     //kware-edit
     this.lang =this.locale ==='ar'? true : false;
     this.isAuthorized$ = this.store.pipe(select(isAuthenticated)); //kware-edit
    this.itemPageRoute = getItemPageRoute(this.object);
    // check to see if iiif viewer is required.
    this.iiifEnabled = isIiifEnabled(this.object);
    this.iiifSearchEnabled = isIiifSearchEnabled(this.object);
    if (this.iiifSearchEnabled) {
      this.iiifQuery$ = getDSpaceQuery(this.object, this.routeService);
    }
  }
}
